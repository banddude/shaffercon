// Centralized BASE_PATH configuration for static HTML files
// Auto-detect: use /shaffercon for GitHub Pages, empty for local dev
const BASE_PATH = window.location.hostname === 'banddude.github.io' ? '/shaffercon' : '';

// Helper function to create full paths
function withBasePath(path) {
    if (!BASE_PATH) {
        return '/' + (path.startsWith('/') ? path.slice(1) : path);
    }
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${BASE_PATH}/${cleanPath}`;
}
