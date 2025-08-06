import { useState, useContext, useEffect, useRef } from 'react'
import { ThemeContext } from '../contexts/ThemeContext'
import { api } from '../services/api'
import { toast } from 'react-toastify'
import { FaUpload } from 'react-icons/fa'

export default function AppearanceForm() {
  const { theme, updateTheme, loading: themeLoading } = useContext(ThemeContext)
  const [formState, setFormState] = useState(theme)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    setFormState(theme)
  }, [theme])

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)
    setUploading(true)
    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setFormState((prevState) => ({ ...prevState, logo: data.secure_url }))
      toast.success('Logo enviado com sucesso!')
    } catch (error) {
      toast.error('Falha ao enviar o logo.')
    } finally {
      setUploading(false)
    }
  }

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
        logo_url: formState.logo,
        primary_color: formState.primaryColor,
        secondary_color: formState.secondaryColor,
      }
      const { data } = await api.put('/admin/organization', payload)
      updateTheme({
        name: data.company_name,
        logo: data.logo_url,
        primaryColor: data.theme_primary_color,
        secondaryColor: data.theme_secondary_color,
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-semibold mb-1 text-gray-700">Nome da Organização</label>
          <input type="text" name="name" id="name" value={formState.name || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 transition" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1 text-gray-700">Logo da Organização</label>
          <div className="flex items-center gap-4 mt-1">
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
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
            >
              <FaUpload />
              {uploading ? 'Enviando...' : 'Alterar Logo'}
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="primaryColor" className="block text-sm font-semibold mb-1 text-gray-700">Cor Primária</label>
          <input type="color" name="primaryColor" id="primaryColor" value={formState.primaryColor || '#000000'} onChange={handleChange} className="mt-1 block w-full h-10 p-1 border border-gray-300 rounded-lg" />
        </div>
        <div className="mb-4">
          <label htmlFor="secondaryColor" className="block text-sm font-semibold mb-1 text-gray-700">Cor Secundária</label>
          <input type="color" name="secondaryColor" id="secondaryColor" value={formState.secondaryColor || '#000000'} onChange={handleChange} className="mt-1 block w-full h-10 p-1 border border-gray-300 rounded-lg" />
        </div>
      </div>
      <div className="flex justify-end">
        <button type="submit" disabled={loading || uploading} className="px-6 py-3 text-sm font-bold text-white rounded-lg shadow transition disabled:opacity-60"
          style={{ background: formState.primaryColor }}>
          {loading ? 'Salvando...' : 'Salvar Aparência'}
        </button>
      </div>
    </form>
  )
}
