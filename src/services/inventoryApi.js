import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: BASE_URL,
})

export const inventoryApi = {
  getAll: () =>
    api.get('/inventory').then(r => r.data),

  getById: (id) =>
    api.get(`/inventory/${id}`).then(r => r.data),

  create: (formData) =>
    api.post('/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data),

  update: (id, data) =>
    api.put(`/inventory/${id}`, data, {
      headers: { 'Content-Type': 'application/json' },
    }).then(r => r.data),

  updatePhoto: (id, formData) =>
    api.put(`/inventory/${id}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data),

  delete: (id) =>
    api.delete(`/inventory/${id}`).then(r => r.data),

  photoUrl: (id) => `${BASE_URL}/inventory/${id}/photo`,
}
