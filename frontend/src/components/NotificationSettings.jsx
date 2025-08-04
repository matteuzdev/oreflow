import { useState, useEffect, useContext } from 'react'
import { api } from '../services/api'
import { toast } from 'react-toastify'
import { ThemeContext } from '../contexts/ThemeContext'

export default function NotificationSettings() {
  const [email, setEmail] = useState(false)
  const [sms, setSms] = useState(false)
  const [loading, setLoading] = useState(true)
  const { theme } = useContext(ThemeContext)
  const primary = theme?.primaryColor || '#2563eb'

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data } = await api.get('/admin/settings/notifications')
        setEmail(!!data.email_notifications)
        setSms(!!data.sms_notifications)
      } catch (error) {
        toast.error('Não foi possível carregar as configurações de notificações.')
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await api.put('/admin/settings/notifications', {
        email_notifications: email ? 1 : 0,
        sms_notifications: sms ? 1 : 0,
      })
      toast.success('Notificações atualizadas!')
    } catch {
      toast.error('Falha ao salvar notificações.')
    }
  }

  if (loading) return <p>Carregando...</p>

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-3">
        <input
          id="email_notifications"
          type="checkbox"
          checked={email}
          onChange={(e) => setEmail(e.target.checked)}
        />
        <label htmlFor="email_notifications" className="font-semibold">
          Receber notificações por e-mail
        </label>
      </div>
      <div className="flex items-center gap-3">
        <input
          id="sms_notifications"
          type="checkbox"
          checked={sms}
          onChange={(e) => setSms(e.target.checked)}
        />
        <label htmlFor="sms_notifications" className="font-semibold">
          Receber notificações por SMS
        </label>
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
