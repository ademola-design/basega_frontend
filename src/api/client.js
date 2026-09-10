/**
 * Centralised API client for BASEGA backend.
 * All pages import from here — never write fetch() calls directly in pages.
 */

import { getToken, clearSession } from './storage'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// ──────────────────────────────────────────
// Core fetch wrapper
// ──────────────────────────────────────────
async function request(method, path, body = null, isFormData = false) {
  const token = getToken()

  const headers = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (!isFormData) headers['Content-Type'] = 'application/json'

  const options = { method, headers }
  if (body) options.body = isFormData ? body : JSON.stringify(body)

  const res = await fetch(`${BASE_URL}${path}`, options)

  // Session gone: drop it and let AuthContext clear the UI and redirect.
  // Throwing (rather than returning undefined) means callers' catch blocks run
  // instead of them trying to render an undefined response.
  if (res.status === 401) {
    clearSession()
    window.dispatchEvent(new CustomEvent('basega:unauthorized'))
    throw new Error('Your session has expired. Please log in again.')
  }

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || data.errors?.[0]?.msg || 'Request failed.')
  return data
}

const get    = (path)         => request('GET',    path)
const post   = (path, body)   => request('POST',   path, body)
const put    = (path, body)   => request('PUT',    path, body)
const del    = (path)         => request('DELETE', path)
const postFD = (path, formData) => request('POST', path, formData, true)

// ──────────────────────────────────────────
// Auth
// ──────────────────────────────────────────
export const authAPI = {
  // Sent as multipart so an optional profile photo can ride along with the form.
  register: (data, photoFile) => {
    const fd = new FormData()
    Object.entries(data).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== '') fd.append(k, v)
    })
    if (photoFile) fd.append('photo', photoFile)
    return postFD('/api/auth/register', fd)
  },
  login:          (email, password) => post('/api/auth/login', { email, password }),
  me:             ()                => get('/api/auth/me'),
  changePassword: (data)            => put('/api/auth/change-password', data),
  forgotPassword: (email)           => post('/api/auth/forgot-password', { email }),
  verifyIdentity: (data)            => post('/api/auth/verify-identity', data),
  resetPassword:  (token, password) => post('/api/auth/reset-password', { token, password }),
}

// ──────────────────────────────────────────
// Members
// ──────────────────────────────────────────
export const membersAPI = {
  list:    (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return get(`/api/members${qs ? '?' + qs : ''}`)
  },
  getById: (id)          => get(`/api/members/${id}`),
  update:  (id, data)    => put(`/api/members/${id}`, data),
  uploadPhoto: (file) => {
    const fd = new FormData()
    fd.append('photo', file)
    return postFD('/api/members/me/photo', fd)
  },
  // Admin
  all:     (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return get(`/api/members/all${qs ? '?' + qs : ''}`)
  },
  pending: ()            => get('/api/members/pending'),
  stats:   ()            => get('/api/members/stats'),
  approve: (id)          => put(`/api/members/${id}/approve`),
  reject:  (id)          => put(`/api/members/${id}/reject`),
  remove:  (id)          => del(`/api/members/${id}`),
}

// ──────────────────────────────────────────
// Events
// ──────────────────────────────────────────
export const eventsAPI = {
  list:    ()          => get('/api/events'),
  getById: (id)        => get(`/api/events/${id}`),
  create:  (data)      => post('/api/events', data),
  update:  (id, data)  => put(`/api/events/${id}`, data),
  remove:  (id)        => del(`/api/events/${id}`),
}

// ──────────────────────────────────────────
// News
// ──────────────────────────────────────────
export const newsAPI = {
  list:     (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return get(`/api/news${qs ? '?' + qs : ''}`)
  },
  getById:  (id)          => get(`/api/news/${id}`),
  adminAll: ()            => get('/api/news/admin/all'),
  create:   (data)        => post('/api/news', data),
  update:   (id, data)    => put(`/api/news/${id}`, data),
  remove:   (id)          => del(`/api/news/${id}`),
}

// ──────────────────────────────────────────
// Gallery
// ──────────────────────────────────────────
export const galleryAPI = {
  list:   ()           => get('/api/gallery'),
  upload: (formData)   => postFD('/api/gallery', formData),
  remove: (id)         => del(`/api/gallery/${id}`),
}

// ──────────────────────────────────────────
// Payments (Paystack)
// ──────────────────────────────────────────
export const paymentsAPI = {
  initiate: (type, amount) => post('/api/payments/initiate', { type, amount }),
  verify:   (reference)    => post(`/api/payments/verify/${reference}`),
  history:  ()             => get('/api/payments/history'),
  all:      ()             => get('/api/payments/all'),
  confirm:  (id)           => put(`/api/payments/${id}/confirm`),
}

// ──────────────────────────────────────────
// Nominations
// ──────────────────────────────────────────
export const nominationsAPI = {
  list:    ()          => get('/api/nominations'),
  current: ()          => get('/api/nominations/current'),
  nominate:(data)      => post('/api/nominations', data),
  all:     ()          => get('/api/nominations/all'),
  select:  (id)        => put(`/api/nominations/${id}/select`),
  reject:  (id)        => put(`/api/nominations/${id}/reject`),
  remove:  (id)        => del(`/api/nominations/${id}`),
}

// ──────────────────────────────────────────
// Messages / Contact
// ──────────────────────────────────────────
export const messagesAPI = {
  send:    (data) => post('/api/messages', data),
  list:    ()     => get('/api/messages'),
  markRead:(id)   => put(`/api/messages/${id}/read`),
}

// ──────────────────────────────────────────
// Helper: get full image URL from a stored path
// ──────────────────────────────────────────
export function imageUrl(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${BASE_URL}${path}`
}
