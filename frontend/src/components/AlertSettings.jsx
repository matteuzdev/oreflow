import { useState, useEffect, useContext } from 'react'
import { api } from '../services/api'
import { toast } from 'react-toastify'
import { ThemeContext } from '../contexts/ThemeContext'

export default function AlertSettings() {
  const [minStock, setMinStock] = useState('')
  const [loading, setLoading] = useState(true)
  const { theme } = useContext(ThemeContext)
  const primary = theme?.primaryColor || '#2563eb'

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data } = await api.get('/admin/settings/alerts')
        setMinStock(data.alert_low_stock ?? '')
      } catch (error) {
        toast.error('Não foi possível carregar as configurações de alertas.')
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await api.put('/admin/settings/alerts', { alert_low_stock: Number(minStock) })
      toast.success('Alertas atualizados!')
    } catch {
      toast.error('Falha ao salvar alertas.')
    }
  }

  if (loading) return <p>Carregando...</p>

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="alert_low_stock" className="block font-semibold mb-1">
          Quantidade mínima em estoque para alerta
        </label>
        <input
          id="alert_low_stock"
          type="number"
          min="0"
          className="border rounded p-2 w-32"
          value={minStock}
          onChange={(e) => setMinStock(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="px-6 py-3 rounded-lg text-white font-bold"
        style={{ background: primary }}
      >
        Salvar
      </button>
    </form>
  )
}
