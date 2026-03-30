import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../hooks/useApi'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const form = new FormData()
        form.append('username', email)
        form.append('password', password)
        const res = await api.post('/auth/login', form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        set({ user: res.data.user, token: res.data.access_token, isAuthenticated: true })
        return res.data
      },

      register: async (name, email, password, company) => {
        const res = await api.post('/auth/register', { name, email, password, company })
        set({ user: res.data.user, token: res.data.access_token, isAuthenticated: true })
        return res.data
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
      },

      getToken: () => get().token,
    }),
    {
      name: 'supportiq-auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated })
    }
  )
)

export default useAuthStore
