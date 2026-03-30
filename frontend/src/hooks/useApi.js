import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 60000,
})

// Inject auth token
api.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem('supportiq-auth')
    if (stored) {
      const { state } = JSON.parse(stored)
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`
      }
    }
  } catch {}
  return config
})

// Handle 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('supportiq-auth')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
