/**
 * Small helper to normalize image paths used across the app.
 * - If an image path is an absolute URL (http(s)) return as-is.
 * - If path starts with '/', prepend API base URL (for backend-served images like /images/*)
 * - Otherwise prefix with '/' so Vite serves local files consistently (e.g. 'src/assets/img/car1.png' -> '/src/assets/img/car1.png').
 */
export function resolveImagePath(path) {
  if (!path) return path
  const p = String(path)
  
  // If already an absolute URL, return as-is
  if (p.startsWith('http://') || p.startsWith('https://')) return p
  
  // If starts with /, prepend API base URL to load from backend
  if (p.startsWith('/')) {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5036/api'
    // Remove /api suffix if present to get just the base domain
    const baseUrl = apiBaseUrl.replace(/\/api$/, '')
    return `${baseUrl}${p}`
  }
  
  // Otherwise treat as local asset
  return `/${p}`
}

export default resolveImagePath
