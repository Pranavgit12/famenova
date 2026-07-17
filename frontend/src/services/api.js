import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export async function submitForm(data) {
  const res = await api.post('/form/submit', data)
  return res.data
}

export async function getLeadCount() {
  const res = await api.get('/form/leads/count')
  return res.data
}

export default api
