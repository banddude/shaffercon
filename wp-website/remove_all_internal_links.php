<?php
/**
 * Remove ALL internal links sections from all pages
 */

echo "Starting bulk internal links removal script...\n\n";

define('WP_API_URL_BASE', 'https://shaffercon.com/wp-json/wp/v2/pages/');
define('WP_USER', 'mikejshaffer@gmail.com');
define('WP_APP_PASSWORD', 'HHSr JIlL GVp2 0JGG fQU3 xAY1');
define('INTERNAL_LINKS_FILE', __DIR__ . '/internal_links.json');
define('SLEEP_SECONDS', 1);

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

    if (curl_errno($ch) || $http_code >= 400) {
        error_log("Error: " . curl_error($ch) . " HTTP $http_code");
        curl_close($ch);
        return null;
    }

    curl_close($ch);
    return json_decode($response, true);
}

// Load internal links data to get page IDs
echo "Loading page data...\n";
$json_string = file_get_contents(INTERNAL_LINKS_FILE);
$all_links = json_decode($json_string, true);

$total_pages = count($all_links);
echo "Found $total_pages pages to process.\n\n";

$cleaned_count = 0;
$skipped_count = 0;
$error_count = 0;

foreach ($all_links as $page_url => $link_data) {
    $page_id = $link_data['page_id'] ?? null;

    if (!$page_id) {
        echo "⚠️  Skipping $page_url - no page ID\n";
        $skipped_count++;
        continue;
    }

    // Get current content
    $url = WP_API_URL_BASE . $page_id;
    $auth = 'Authorization: Basic ' . base64_encode(WP_USER . ':' . WP_APP_PASSWORD);
    $response = make_request($url, 'GET', null, $auth);

    if (!$response || !isset($response['content'])) {
        echo "❌ Failed to fetch Page ID $page_id\n";
        $error_count++;
        sleep(SLEEP_SECONDS);
        continue;
    }

    $content = $response['content']['rendered'];

    // Check if page has internal links
    if (strpos($content, '<!-- Internal Links -->') === false) {
        $skipped_count++;
        sleep(SLEEP_SECONDS);
        continue;
    }

    // Remove all internal links patterns
    $original_length = strlen($content);

    $patterns = [
        '/<!-- Internal Links -->.*?<!-- End Internal Links -->/s',
        '/<!-- Internal Links Section -->.*?<!-- End Internal Links Section -->/s',
        "/<div class='internal-links-section'.*?<\/div>\s*<!-- End Internal Links -->/s",
    ];

    foreach ($patterns as $pattern) {
        $content = preg_replace($pattern, '', $content);
    }

    // Clean up orphaned comment tags
    $content = preg_replace('/<p><!-- (Internal Links|End Internal Links).*?--><\/p>/', '', $content);
    $content = preg_replace('/<!-- (Internal Links|End Internal Links).*?-->/', '', $content);

    $new_length = strlen($content);

    // Only update if something was removed
    if ($original_length === $new_length) {
        $skipped_count++;
        sleep(SLEEP_SECONDS);
        continue;
    }

    // Update page
    $update_data = ['content' => $content];
    $result = make_request($url, 'PUT', $update_data, $auth);

    if ($result && isset($result['id'])) {
        $removed = $original_length - $new_length;
        echo "✅ Cleaned Page ID $page_id - Removed $removed characters\n";
        $cleaned_count++;
    } else {
        echo "❌ Failed to update Page ID $page_id\n";
        $error_count++;
    }

    sleep(SLEEP_SECONDS);
}

echo "\n--- Removal Summary ---\n";
echo "Total Pages: $total_pages\n";
echo "Successfully Cleaned: $cleaned_count\n";
echo "Skipped (No links found): $skipped_count\n";
echo "Errors: $error_count\n";

exit(0);
?>
