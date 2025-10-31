<?php

// --- CONFIGURATION ---
// WARNING: Storing credentials directly in the script is insecure. Use environment variables or a secure config file outside the web root.
define('WP_API_URL', 'https://shaffercon.com/wp-json/wp/v2/pages/');
define('WP_USER', 'mikejshaffer@gmail.com');
define('WP_APP_PASSWORD', 'HHSr JIlL GVp2 0JGG fQU3 xAY1'); // Replace with your actual App Password

// Business Details (Used in Prompt)
define('BUSINESS_NAME', 'Shaffer Construction, Inc.');
define('BUSINESS_ADDRESS_STREET', '325 N Larchmont Blvd. #202');
define('BUSINESS_ADDRESS_LOCALITY', 'Los Angeles');
define('BUSINESS_ADDRESS_REGION', 'CA');
define('BUSINESS_ADDRESS_POSTALCODE', '90004');
define('BUSINESS_ADDRESS_COUNTRY', 'US');
define('BUSINESS_TELEPHONE', '+1-323-642-8509');
define('BUSINESS_URL', 'https://shaffercon.com');
define('BUSINESS_ID', BUSINESS_URL . '/#organization');
define('BUSINESS_TYPE', 'Electrician'); // More specific than LocalBusiness
// --- END CONFIGURATION ---

// --- HELPER FUNCTIONS ---
function make_request($url, $method = 'GET', $data = null, $auth_header = null) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 60); // 60 second timeout

    if ($auth_header) {
        curl_setopt($ch, CURLOPT_HTTPHEADER, [$auth_header, 'Content-Type: application/json']);
    } else {
         curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    }


    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    } elseif ($method === 'PUT') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if (curl_errno($ch)) {
        error_log('Request Error for ' . $url . ': ' . curl_error($ch));
        curl_close($ch);
        return null;
    }

     if ($http_code >= 400) {
         error_log("HTTP Error $http_code for $url. Response: $response");
         curl_close($ch);
         return null;
     }

    curl_close($ch);
    return json_decode($response, true);
}

function get_page_data($page_id) {
    $url = WP_API_URL . $page_id;
    $auth = 'Authorization: Basic ' . base64_encode(WP_USER . ':' . WP_APP_PASSWORD);
    $response = make_request($url, 'GET', null, $auth);
    if ($response && isset($response['id'])) {
        return [
            'title' => $response['title']['rendered'] ?? 'Unknown Title',
            'content' => $response['content']['rendered'] ?? '',
            'url' => $response['link'] ?? '',
        ];
    }
    error_log("Failed to get data for page ID: $page_id");
    return null;
}

function update_page_content($page_id, $new_content) {
     $url = WP_API_URL . $page_id;
     $auth = 'Authorization: Basic ' . base64_encode(WP_USER . ':' . WP_APP_PASSWORD);
     $data = ['content' => $new_content];
     $response = make_request($url, 'PUT', $data, $auth); // Use PUT for updates
     return ($response && isset($response['id']));
}

// NEW: Function to convert slug to readable title case
function slug_to_readable($slug) {
    return ucwords(str_replace('-', ' ', $slug));
}

// NEW: Mapping for location slugs to their details
function get_location_details($location_slug) {
    // Map slug => ['name' => Proper Name, 'locality' => Containing City]
    $locations = [
        'atwater-village' => ['name' => 'Atwater Village', 'locality' => 'Los Angeles'],
        'beverly-hills' => ['name' => 'Beverly Hills', 'locality' => 'Beverly Hills'],
        'boyle-heights' => ['name' => 'Boyle Heights', 'locality' => 'Los Angeles'],
        'burbank' => ['name' => 'Burbank', 'locality' => 'Burbank'],
        'culver-city' => ['name' => 'Culver City', 'locality' => 'Culver City'],
        'echo-park' => ['name' => 'Echo Park', 'locality' => 'Los Angeles'],
        'glendale' => ['name' => 'Glendale', 'locality' => 'Glendale'],
        'highland-park' => ['name' => 'Highland Park', 'locality' => 'Los Angeles'],
        'hollywood' => ['name' => 'Hollywood', 'locality' => 'Los Angeles'],
        'inglewood' => ['name' => 'Inglewood', 'locality' => 'Inglewood'],
        'long-beach' => ['name' => 'Long Beach', 'locality' => 'Long Beach'],
        'los-feliz' => ['name' => 'Los Feliz', 'locality' => 'Los Angeles'],
        'pasadena' => ['name' => 'Pasadena', 'locality' => 'Pasadena'],
        'santa-clarita' => ['name' => 'Santa Clarita', 'locality' => 'Santa Clarita'],
        'santa-monica' => ['name' => 'Santa Monica', 'locality' => 'Santa Monica'],
        'sherman-oaks' => ['name' => 'Sherman Oaks', 'locality' => 'Los Angeles'],
        'silver-lake' => ['name' => 'Silver Lake', 'locality' => 'Los Angeles'],
        'torrance' => ['name' => 'Torrance', 'locality' => 'Torrance'],
        'venice' => ['name' => 'Venice', 'locality' => 'Los Angeles'], // Treating Venice as LA neighborhood
        'west-hollywood' => ['name' => 'West Hollywood', 'locality' => 'West Hollywood'] // West Hollywood is its own city
    ];

    return $locations[$location_slug] ?? null; // Return null if slug not found
}

// --- END HELPER FUNCTIONS ---

// --- MAIN SCRIPT ---
if ($argc < 2) {
    echo "Usage: php add_schema_to_page.php <PAGE_ID>\n";
    exit(1);
}

$page_id = intval($argv[1]);
if ($page_id <= 0) {
     echo "Invalid Page ID provided.\n";
     exit(1);
}

echo "Fetching data for Page ID: $page_id...\n";
$page_data = get_page_data($page_id);

if (!$page_data || empty($page_data['url'])) {
    echo "Error: Could not fetch page data or URL for Page ID $page_id.\n";
    exit(1);
}

$page_url = $page_data['url'];

// Simple check to avoid adding schema if already present
if (strpos($page_data['content'], 'application/ld+json') !== false) {
    echo "Warning: Page ID $page_id seems to already contain JSON-LD schema. Skipping.\n";
     exit(0); // Exit cleanly if schema exists
}

// --- NEW: Parse URL for slugs ---
echo "Parsing URL: $page_url\n";
$url_path = parse_url($page_url, PHP_URL_PATH);
$path_parts = array_values(array_filter(explode('/', $url_path))); // Get non-empty path parts

if (count($path_parts) < 3 || $path_parts[0] !== 'service-areas') {
    echo "Error: URL structure doesn't match expected '/service-areas/{location}/{service}/' pattern.\n";
    exit(1);
}

$location_slug = $path_parts[count($path_parts) - 2]; // Second to last part
$service_slug = $path_parts[count($path_parts) - 1]; // Last part

// --- NEW: Get details programmatically ---
echo "Extracting details from slugs...\n";
$location_details = get_location_details($location_slug);
$readable_service_name = slug_to_readable($service_slug);

if (!$location_details) {
    echo "Error: Could not find details for location slug: $location_slug. Update the mapping in the script.\n";
    exit(1);
}

$location_name = $location_details['name'];
$location_locality = $location_details['locality'];

echo "Service: $readable_service_name\n";
echo "Location Name: $location_name\n";
echo "Location Locality: $location_locality\n";

// --- Build Schema Programmatically ---

// Construct the @graph array programmatically
$graph_array = [
    // Business object (constant)
    [
        "@type" => BUSINESS_TYPE,
        "@id" => BUSINESS_ID,
        "name" => BUSINESS_NAME,
        "address" => [
            "@type" => "PostalAddress",
            "streetAddress" => BUSINESS_ADDRESS_STREET,
            "addressLocality" => BUSINESS_ADDRESS_LOCALITY, // Main business locality
            "addressRegion" => BUSINESS_ADDRESS_REGION,
            "postalCode" => BUSINESS_ADDRESS_POSTALCODE,
            "addressCountry" => BUSINESS_ADDRESS_COUNTRY
        ],
        "telephone" => BUSINESS_TELEPHONE,
        "url" => BUSINESS_URL
    ],
    // Service object (using parsed details)
    [
        "@type" => "Service",
        "@id" => $page_url . "#service", // Unique ID based on page URL
        "name" => $readable_service_name . " in " . $location_name, // Combined name
        "serviceType" => $readable_service_name, // Parsed service
        "provider" => [
            "@id" => BUSINESS_ID // Link back to business
        ],
        "areaServed" => [
            "@type" => "City",
            "name" => $location_name, // Parsed location name
             "address" => [ // Add context for the city/area
                 "@type" => "PostalAddress",
                 "addressLocality" => $location_locality, // Mapped locality (City)
                 "addressRegion" => BUSINESS_ADDRESS_REGION,
                 "addressCountry" => BUSINESS_ADDRESS_COUNTRY
            ]
        ],
        "url" => $page_url // Specific page URL
    ]
];

// Construct the full JSON-LD object
$full_schema_object = [
    "@context" => "https://schema.org",
    "@graph" => $graph_array
];

// Prettify the final JSON for readability in HTML source
$schema_json_string = json_encode($full_schema_object, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

// Create the script tag
$schema_script_tag = "\n<script type=\"application/ld+json\">\n" . $schema_json_string . "\n</script>\n";

// --- Keep the update logic ---
echo "Appending schema to page content...\n";
$new_content = $page_data['content'] . $schema_script_tag; // Append to existing content

echo "Updating page ID $page_id via WordPress API...\n";
if (update_page_content($page_id, $new_content)) {
    echo "Success! Page ID $page_id updated with Schema markup.\n";
} else {
    echo "Error: Failed to update page content via API.\n";
    exit(1);
}

exit(0);
// --- END MAIN SCRIPT ---
?> 