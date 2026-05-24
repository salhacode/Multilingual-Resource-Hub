const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000').replace(
  /\/$/,
  '',
)

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options)
  const rawBody = await response.text()
  const data = rawBody ? JSON.parse(rawBody) : null

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
