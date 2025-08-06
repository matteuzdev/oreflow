import { useState, useContext, useEffect } from 'react'
import { ThemeContext } from '../contexts/ThemeContext'
import { api } from '../services/api'
import { toast } from 'react-toastify'

export default function AppearanceForm() {
  const { theme, updateTheme, loading: themeLoading } = useContext(ThemeContext)
  const [formState, setFormState] = useState(theme)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setFormState(theme)
  }, [theme])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormState((prevState) => ({ ...prevState, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        name: formState.name,
        logo: formState.logo,
        primary_color: formState.primaryColor,
        secondary_color: formState.secondaryColor,
      }
      const { data } = await api.put('/admin/organization', payload)
      updateTheme({
        name: data.name,
        logo: data.logo,
        primaryColor: data.primary_color,
        secondaryColor: data.secondary_color,
      })
      toast.success('Aparência atualizada com sucesso!')
    } catch (error) {
      toast.error('Falha ao atualizar a aparência.')
    } finally {
      setLoading(false)
    }
  }

  if (themeLoading) {
    return <p>Carregando tema...</p>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center gap-6 mb-2">
        <div
          className="w-20 h-20 flex items-center justify-center rounded-xl border-2 bg-gray-50 shadow"
          style={{ borderColor: formState.primaryColor || '#4f46e5' }}
        >
          {formState.logo ? (
            <img src={formState.logo} alt="Logo" className="object-contain h-16" />
          ) : (
            <span className="text-gray-300 text-4xl">?</span>
          )}
        </div>
        <div>
          <p className="text-lg font-bold text-gray-800">{formState.name || 'Nome da Organização'}</p>
          <p className="text-sm text-gray-500">Pré-visualização</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-semibold mb-1 text-gray-700">Nome da Organização</label>
          <input type="text" name="name" id="name" value={formState.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 transition" />
        </div>
        <div className="mb-4">
          <label htmlFor="logo" className="block text-sm font-semibold mb-1 text-gray-700">URL do Logo</label>
          <input type="text" name="logo" id="logo" value={formState.logo} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 transition" />
        </div>
        <div className="mb-4">
          <label htmlFor="primaryColor" className="block text-sm font-semibold mb-1 text-gray-700">Cor Primária</label>
          <input type="color" name="primaryColor" id="primaryColor" value={formState.primaryColor} onChange={handleChange} className="mt-1 block w-full h-10 p-1 border border-gray-300 rounded-lg" />
        </div>
        <div className="mb-4">
          <label htmlFor="secondaryColor" className="block text-sm font-semibold mb-1 text-gray-700">Cor Secundária</label>
          <input type="color" name="secondaryColor" id="secondaryColor" value={formState.secondaryColor} onChange={handleChange} className="mt-1 block w-full h-10 p-1 border border-gray-300 rounded-lg" />
        </div>
      </div>
      <div className="flex justify-end">
        <button type="submit" disabled={loading} className="px-6 py-3 text-sm font-bold text-white rounded-lg shadow transition disabled:opacity-60"
          style={{ background: formState.primaryColor }}>
          {loading ? 'Salvando...' : 'Salvar Aparência'}
        </button>
      </div>
    </form>
  )
}
