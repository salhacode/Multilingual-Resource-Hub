// In production the frontend is served by the same Express process as the API, so an
// empty base URL makes fetch() use same-origin (relative) requests. In dev, the .env
// file sets VITE_API_BASE_URL to the local backend (e.g. http://localhost:4000).
function resolveApiOrigin() {
  const raw = import.meta.env.VITE_API_BASE_URL
  const trimmed = raw != null ? String(raw).trim() : ''
  return trimmed.replace(/\/$/, '')
}

const API_BASE_URL = resolveApiOrigin()

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options)
  const rawBody = await response.text()
  let data = null
  if (rawBody) {
    try {
      data = JSON.parse(rawBody)
    } catch {
      data = null
    }
  }

  if (!response.ok) {
    const message =
      data?.error || data?.message || 'Request failed. Please try again.'
    throw new Error(message)
  }

  return data
}

export async function fetchResources() {
  const data = await request('/api/resources')
  if (Array.isArray(data)) {
    return data
  }

  return Array.isArray(data?.resources) ? data.resources : []
}

export async function createResource(payload) {
  return request('/api/resources', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

export async function updateResource(id, payload) {
  return request(`/api/resources/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

export async function deleteResource(id) {
  return request(`/api/resources/${id}`, {
    method: 'DELETE',
  })
}
