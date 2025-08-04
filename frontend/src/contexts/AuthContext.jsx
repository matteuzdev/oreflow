import { createContext, useState, useEffect } from 'react'
import { api } from '../services/api'
import { jwtDecode } from 'jwt-decode'

// Exportação nomeada aqui!
export const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStorageData() {
      const storagedToken = localStorage.getItem('@OreFlow:token')
      const storagedUser = localStorage.getItem('@OreFlow:user')

      if (storagedToken && storagedUser) {
        setToken(storagedToken)
        setUser(JSON.parse(storagedUser))
        // O interceptor do api.js já cuida disso.
        // api.defaults.headers.common['x-auth-token'] = storagedToken
      }
      setLoading(false)
    }
    loadStorageData()
  }, [])

  async function login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token, user } = response.data

      localStorage.setItem('@OreFlow:token', token)
      localStorage.setItem('@OreFlow:user', JSON.stringify(user))

      setToken(token)
      setUser(user)

      // O interceptor do api.js já cuida disso.
      // api.defaults.headers.common['x-auth-token'] = token
    } catch (error) {
      console.error('Login failed', error)
      throw error
    }
  }

  function logout() {
    localStorage.removeItem('@OreFlow:token')
    localStorage.removeItem('@OreFlow:user')
    setToken(null)
    setUser(null)
  }

  const isAdmin = user ? user.role === 'admin' : false

  return (
    <AuthContext.Provider
      value={{
        signed: !!token,
        user,
        setUser,
        token,
        isAdmin,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
