<?php
/**
 * CORRECT APPROACH: Use REAL pages from the website
 * - Fetches ALL pages grouped by location
 * - For each location, finds ALL actual services available
 * - Links ONLY to services that ACTUALLY EXIST
 * - No hardcoding, no guessing
 */

define('WP_API_URL_BASE', 'https://shaffercon.com/wp-json/wp/v2/pages/');
define('WP_USER', 'mikejshaffer@gmail.com');
define('WP_APP_PASSWORD', 'HHSr JIlL GVp2 0JGG fQU3 xAY1');

echo "=== REAL LINKS PROCESSOR ===\n";
echo "Step 1: Fetching ALL pages from website...\n";

// Fetch ALL pages and group by location
$pages_by_location = [];
$all_pages_map = [];
$page = 1;

while (true) {
    $url = WP_API_URL_BASE . "?page=$page&per_page=100";
    $auth = 'Authorization: Basic ' . base64_encode(WP_USER . ':' . WP_APP_PASSWORD);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [$auth]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 60);

    $response = curl_exec($ch);
    curl_close($ch);

    $pages = json_decode($response, true);
    if (!is_array($pages) || empty($pages)) break;

    foreach ($pages as $p) {
        // Must match /service-areas/LOCATION/SERVICE/ format
        if (preg_match('#^https://shaffercon\.com/service-areas/([a-z\-]+)/([a-z\-]+)/$#', $p['link'], $m)) {
            $location = $m[1];
            $service = $m[2];

            if (!isset($pages_by_location[$location])) {
                $pages_by_location[$location] = [];
            }
            $pages_by_location[$location][$service] = [
                'id' => $p['id'],
                'url' => $p['link'],
                'title' => $p['title']['rendered'] ?? ''
            ];
            $all_pages_map[$p['id']] = ['location' => $location, 'service' => $service];
        }
    }

    if (count($pages) < 100) break;
    $page++;
    usleep(200000);
}

echo "Found " . count($all_pages_map) . " valid service pages\n";
echo "Found " . count($pages_by_location) . " unique locations\n\n";

// Show what we found
echo "Locations and services available:\n";
foreach ($pages_by_location as $loc => $services) {
    echo "  $loc: " . count($services) . " services\n";
}
echo "\n";

echo "Step 2: Applying links to all pages...\n";
$updated = 0;
$failed = 0;

foreach ($all_pages_map as $page_id => $page_info) {
    $current_location = $page_info['location'];
    $current_service = $page_info['service'];

    $url = WP_API_URL_BASE . $page_id;
    $auth = 'Authorization: Basic ' . base64_encode(WP_USER . ':' . WP_APP_PASSWORD);

    // Fetch page
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [$auth]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 60);
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($http_code !== 200) {
        $failed++;
        echo "[" . ($updated + $failed) . "] ❌ Failed to fetch $current_location/$current_service\n";
        continue;
    }

    $page_obj = json_decode($response, true);
    $content = $page_obj['content']['rendered'] ?? '';

    // Remove old internal links
    $patterns = [
        '/<p><!-- Internal Links --><\/p>.*?<p><!-- End Internal Links --><\/p>/s',
        '/<!-- Internal Links -->.*?<!-- End Internal Links -->/s',
    ];
    foreach ($patterns as $pattern) {
        $content = preg_replace($pattern, '', $content);
    }

    // Build links from REAL services in this location
    $html = "\n\n<!-- Internal Links -->\n";
    $html .= "<div style='max-width: 1200px; margin: 60px auto; padding: 0 20px;'>\n";
    $html .= "<div style='display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px;'>\n";

    // Related services - use REAL services from this location
    $html .= "<div>\n<h3>Related Services in " . ucwords(str_replace('-', ' ', $current_location)) . "</h3>\n<ul>\n";

    $services_in_location = $pages_by_location[$current_location] ?? [];
    $shown_services = 0;
    foreach ($services_in_location as $service => $info) {
        if ($service !== $current_service && $shown_services < 5) {
            $service_title = ucwords(str_replace('-', ' ', $service));
            $html .= "<li><a href='{$info['url']}'>{$service_title}</a></li>\n";
            $shown_services++;
        }
    }
    $html .= "</ul>\n</div>\n";

    // Nearby areas - use REAL locations that exist
    $html .= "<div>\n<h3>Nearby Areas We Serve</h3>\n<ul>\n";

    // Get all unique locations
    $all_locations = array_keys($pages_by_location);
    sort($all_locations);

    $shown_areas = 0;
    foreach ($all_locations as $other_location) {
        if ($other_location !== $current_location && $shown_areas < 5) {
            // Check if this location has the CURRENT service
            if (isset($pages_by_location[$other_location][$current_service])) {
                $link = $pages_by_location[$other_location][$current_service]['url'];
                $location_title = ucwords(str_replace('-', ' ', $other_location));
                $html .= "<li><a href='$link'>$location_title</a></li>\n";
                $shown_areas++;
            }
        }
    }
    $html .= "</ul>\n</div>\n</div>\n";

    // Navigation
    $html .= "<div style='text-align: center; margin: 20px 0 0 0;'>\n";
    $html .= "<a href='https://shaffercon.com/service-areas/$current_location/'>All " . ucwords(str_replace('-', ' ', $current_location)) . " Services</a> | ";
    $html .= "<a href='https://shaffercon.com/service-areas/'>All Service Areas</a> | ";
    $html .= "<a href='https://shaffercon.com/'>Home</a> | ";
    $html .= "<a href='https://shaffercon.com/about-us/'>About Us</a> | ";
    $html .= "<a href='https://shaffercon.com/contact-us/'>Contact Us</a>\n";
    $html .= "</div>\n</div>\n<!-- End Internal Links -->\n\n";

    $new_content = $content . $html;
    $data = ['content' => $new_content];

    // Update page
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [$auth, 'Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_TIMEOUT, 60);
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($http_code === 200) {
        $updated++;
        echo "[" . ($updated + $failed) . "/842] ✅ $current_location/$current_service\n";
    } else {
        $failed++;
        echo "[" . ($updated + $failed) . "/842] ❌ $current_location/$current_service (HTTP $http_code)\n";
    }
}

echo "\n--- COMPLETED ---\n";
echo "Successfully updated: $updated pages\n";
echo "Failed: $failed pages\n";
echo "Total processed: " . count($all_pages_map) . " pages\n";

exit(0);
?>
