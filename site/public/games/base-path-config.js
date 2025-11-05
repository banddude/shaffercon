// Centralized BASE_PATH configuration for static HTML files
// This should match the BASE_PATH in app/config.ts
const BASE_PATH = '/shaffercon';

// Helper function to create full paths
function withBasePath(path) {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${BASE_PATH}/${cleanPath}`;
}
