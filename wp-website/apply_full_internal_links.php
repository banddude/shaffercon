<?php
/**
 * Apply Full 4-Tier Internal Links to ALL Service Pages
 * Fetches all pages from WordPress and generates complete link matrix in real-time
 */

echo "Building and applying full 4-tier internal links to all 880+ service pages...\n\n";

define('WP_API_URL_BASE', 'https://shaffercon.com/wp-json/wp/v2/pages/');
define('WP_USER', 'mikejshaffer@gmail.com');
define('WP_APP_PASSWORD', 'HHSr JIlL GVp2 0JGG fQU3 xAY1');
define('SLEEP_SECONDS', 0.1);

// Expected 22 locations
$locations = [
    'atwater-village', 'beverly-hills', 'boyle-heights', 'burbank', 'culver-city',
    'echo-park', 'glendale', 'highland-park', 'hollywood', 'inglewood',
    'long-beach', 'los-feliz', 'pasadena', 'santa-clarita', 'santa-monica',
    'sherman-oaks', 'silver-lake', 'torrance', 'venice', 'west-hollywood',
    'altadena', 'pacific-palisades'
];

// Location coordinates for nearby calculation
$location_coords = [
    'atwater-village' => (34.1186 + -118.2532),
    'beverly-hills' => (34.0736 + -118.4004),
    'boyle-heights' => (34.0381 + -118.2048),
    'burbank' => (34.1808 + -118.3090),
    'culver-city' => (34.0211 + -118.3965),
    'echo-park' => (34.0780 + -118.2607),
    'glendale' => (34.1425 + -118.2551),
    'highland-park' => (34.1139 + -118.1945),
    'hollywood' => (34.0928 + -118.3287),
    'inglewood' => (33.9617 + -118.3531),
    'long-beach' => (33.7701 + -118.1937),
    'los-feliz' => (34.1076 + -118.2843),
    'pasadena' => (34.1478 + -118.1445),
    'santa-clarita' => (34.3917 + -118.5426),
    'santa-monica' => (34.0195 + -118.4912),
    'sherman-oaks' => (34.1508 + -118.4490),
    'silver-lake' => (34.0870 + -118.2704),
    'torrance' => (33.8358 + -118.3406),
    'venice' => (33.9850 + -118.4695),
    'west-hollywood' => (34.0900 + -118.3617),
    'altadena' => (34.1897 + -118.1312),
    'pacific-palisades' => (34.0453 + -118.5260),
];

// Helper functions
function make_request($url, $method = 'GET', $data = null, $auth_header = null) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 60);

    if ($auth_header) {
        curl_setopt($ch, CURLOPT_HTTPHEADER, [$auth_header, 'Content-Type: application/json']);
    } else {
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    }

    if ($method === 'PUT') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if (curl_errno($ch)) {
        curl_close($ch);
        return null;
    }

    if ($http_code >= 400) {
        curl_close($ch);
        return null;
    }

    curl_close($ch);
    return json_decode($response, true);
}

function fetch_page($page_id) {
    $url = WP_API_URL_BASE . $page_id;
    $auth = 'Authorization: Basic ' . base64_encode(WP_USER . ':' . WP_APP_PASSWORD);
    $response = make_request($url, 'GET', null, $auth);
    if ($response && isset($response['id'])) {
        return $response['content']['rendered'] ?? '';
    }
    return null;
}

function update_page($page_id, $new_content) {
    $url = WP_API_URL_BASE . $page_id;
    $auth = 'Authorization: Basic ' . base64_encode(WP_USER . ':' . WP_APP_PASSWORD);
    $data = ['content' => $new_content];
    $response = make_request($url, 'PUT', $data, $auth);
    return ($response && isset($response['id']));
}

function build_full_links_html($page_data, $all_pages, $location, $service) {
    $html = "\n\n<!-- Internal Links -->\n";
    $html .= "<div style='max-width: 1200px; margin: 60px auto; padding: 0 20px;'>\n";
    $html .= "<div style='display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px;'>\n";

    // Related Services (same location, other services)
    $related_services = [];
    foreach ($all_pages as $p) {
        if ($p['location'] === $location && $p['service'] !== $service && !isset($related_services[$p['service']])) {
            $related_services[$p['service']] = $p['url'];
            if (count($related_services) >= 5) break;
        }
    }

    if (!empty($related_services)) {
        $html .= "<div>\n";
        $html .= "<h3>Related Services in " . ucwords(str_replace('-', ' ', $location)) . "</h3>\n";
        $html .= "<ul>\n";
        foreach ($related_services as $svc => $url) {
            $label = ucwords(str_replace('-', ' ', $svc));
            $html .= "<li><a href='" . htmlspecialchars($url) . "'>$label</a></li>\n";
        }
        $html .= "</ul>\n";
        $html .= "</div>\n";
    }

    // Nearby Locations (same service, nearby areas)
    $nearby = [];
    foreach ($all_pages as $p) {
        if ($p['service'] === $service && $p['location'] !== $location && !isset($nearby[$p['location']])) {
            $nearby[$p['location']] = $p['url'];
            if (count($nearby) >= 5) break;
        }
    }

    if (!empty($nearby)) {
        $html .= "<div>\n";
        $html .= "<h3>Nearby Areas We Serve</h3>\n";
        $html .= "<ul>\n";
        foreach ($nearby as $loc => $url) {
            $label = ucwords(str_replace('-', ' ', $loc));
            $html .= "<li><a href='" . htmlspecialchars($url) . "'>$label</a></li>\n";
        }
        $html .= "</ul>\n";
        $html .= "</div>\n";
    }

    $html .= "</div>\n";

    // Bottom navigation links (all on one line, no bold)
    $html .= "<div style='text-align: center; margin: 20px 0 0 0;'>\n";
    $html .= "<a href='https://shaffercon.com/service-areas/$location/'>". ucwords(str_replace('-', ' ', $location)) . " Services Hub</a> | <a href='https://shaffercon.com/service-areas/'>All Service Areas</a> | <a href='https://shaffercon.com/'>Home</a> | <a href='https://shaffercon.com/about-us/'>About Us</a> | <a href='https://shaffercon.com/contact-us/'>Contact Us</a>\n";
    $html .= "</div>\n";

    $html .= "</div>\n";
    $html .= "<!-- End Internal Links -->\n\n";

    return $html;
}

// Step 1: Fetch all service pages
echo "Step 1: Fetching all service pages from WordPress...\n";
$all_pages = [];
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
        if (strpos($p['link'], '/service-areas/') !== false) {
            foreach ($locations as $loc) {
                if (preg_match("#/service-areas/$loc/(.+)/$#", $p['link'], $matches)) {
                    $all_pages[] = [
                        'id' => $p['id'],
                        'url' => $p['link'],
                        'location' => $loc,
                        'service' => $matches[1]
                    ];
                    break;
                }
            }
        }
    }

    if (count($pages) < 100) break;
    $page++;
    usleep(300000);
}

echo "Found " . count($all_pages) . " service pages\n\n";

// Step 2: Apply full links to all pages
echo "Step 2: Applying full 4-tier links to all pages...\n";
$updated = 0;
$failed = 0;

foreach ($all_pages as $idx => $page_data) {
    $content = fetch_page($page_data['id']);
    if ($content === null) {
        $failed++;
        usleep(SLEEP_SECONDS * 1000000);
        continue;
    }

    // Remove old links (handle both with and without paragraph tags)
    $patterns = [
        '/<p><!-- Internal Links --><\/p>.*?<p><!-- End Internal Links --><\/p>/s',
        '/<!-- Internal Links -->.*?<!-- End Internal Links -->/s',
        '/<!-- Internal Links Section -->.*?<!-- End Internal Links Section -->/s',
    ];

    foreach ($patterns as $pattern) {
        $content = preg_replace($pattern, '', $content);
    }

    // Add new full links
    $links_html = build_full_links_html($page_data, $all_pages, $page_data['location'], $page_data['service']);
    $new_content = $content . $links_html;

    // Update page
    if (update_page($page_data['id'], $new_content)) {
        $updated++;
        if ($updated % 50 === 0) {
            echo "✅ Updated $updated pages...\n";
        }
    } else {
        $failed++;
    }

    usleep(SLEEP_SECONDS * 1000000);
}

echo "\n--- Final Results ---\n";
echo "Successfully updated: $updated pages\n";
echo "Failed: $failed pages\n";
echo "Total: " . count($all_pages) . " pages\n";

exit(0);
?>
