<?php
/**
 * Delete the backup-generator-installation page
 */

define('WP_API_URL_BASE', 'https://shaffercon.com/wp-json/wp/v2/pages/');
define('WP_USER', 'mikejshaffer@gmail.com');
define('WP_APP_PASSWORD', 'HHSr JIlL GVp2 0JGG fQU3 xAY1');

$target_url = 'https://shaffercon.com/backup-generator-installation/';

echo "=== DELETE BACKUP GENERATOR PAGE ===\n\n";
echo "Finding page: $target_url\n";

// Find the page ID
$page = 1;
$page_id = null;

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
        if ($p['link'] === $target_url) {
            $page_id = $p['id'];
            break 2;
        }
    }

    if (count($pages) < 100) break;
    $page++;
}

if (!$page_id) {
    die("Page not found!\n");
}

echo "Found page ID: $page_id\n";
echo "Deleting...\n";

// Delete the page
$url = WP_API_URL_BASE . $page_id;
$auth = 'Authorization: Basic ' . base64_encode(WP_USER . ':' . WP_APP_PASSWORD);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [$auth]);
curl_setopt($ch, CURLOPT_TIMEOUT, 60);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code === 200) {
    echo "✅ Page deleted successfully!\n";
} else {
    echo "❌ Delete failed! HTTP $http_code\n";
    echo "Response: " . substr($response, 0, 500) . "\n";
}

exit(0);
?>
