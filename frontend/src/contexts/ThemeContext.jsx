import { createContext, useState, useEffect } from 'react'
import { api } from '../services/api'

export const ThemeContext = createContext({})

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState({
    name: 'OreFlow',
    logo: '',
    primaryColor: '#4f46e5', // indigo-600
    secondaryColor: '#6b7280', // gray-500
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrganization() {
      try {
        const response = await api.get('/admin/organization')
        // Suporte tanto para snake_case quanto camelCase
        const { name, logo, primary_color, secondary_color, primaryColor, secondaryColor } = response.data
        setTheme({
          name: name || 'OreFlow',
          logo: logo || '',
          primaryColor: primary_color || primaryColor || '#4f46e5',
          secondaryColor: secondary_color || secondaryColor || '#6b7280',
        })
      } catch (error) {
        console.error('Failed to fetch organization theme', error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrganization()
  }, [])

  const updateTheme = (newTheme) => {
    setTheme((prev) => ({
      ...prev,
      ...newTheme,
    }))
    // Se quiser atualizar no backend:
    // api.put('/admin/organization', newTheme)
  }

  useEffect(() => {
    // Aplicar variáveis CSS para usar no Tailwind
    const root = document.documentElement
    root.style.setProperty('--color-primary', theme.primaryColor)
    root.style.setProperty('--color-secondary', theme.secondaryColor)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, loading }}>
      {children}
    </ThemeContext.Provider>
  )
}
