import { useState, useEffect, useContext } from 'react'
import { ThemeContext } from '../contexts/ThemeContext'

export default function UserForm({ user, onSubmit, onCancel }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('user')
  const { theme } = useContext(ThemeContext)
  const primary = theme?.primaryColor || '#2563eb'

  const isEditing = !!user

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
      setRole(user.role || 'user')
    } else {
      setName('')
      setEmail('')
      setRole('user')
    }
  }, [user])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Para convidar, enviamos nome, email e cargo.
    // Para editar, apenas nome e cargo.
    const payload = isEditing ? { name, role } : { name, email, role }
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium mb-1" style={{ color: primary }}>
          Nome
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none transition"
          style={{ borderColor: primary, boxShadow: `0 0 0 1.5px ${primary}22` }}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: primary }}>
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={isEditing}
          className="mt-1 block w-full px-4 py-2 border rounded-lg disabled:bg-gray-100 focus:outline-none transition"
          style={{ borderColor: primary, boxShadow: `0 0 0 1.5px ${primary}22` }}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="role" className="block text-sm font-medium mb-1" style={{ color: primary }}>
          Cargo
        </label>
        <select
          id="role"
          value={role}
          onChange={e => setRole(e.target.value)}
          required
          className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none transition"
          style={{ borderColor: primary, boxShadow: `0 0 0 1.5px ${primary}22` }}
        >
          <option value="user">Usuário</option>
          <option value="admin">Administrador</option>
        </select>
      </div>
      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 mr-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-bold text-white rounded-lg shadow transition"
          style={{ background: primary }}
        >
          {isEditing ? 'Salvar Alterações' : 'Enviar Convite'}
        </button>
      </div>
    </form>
  )
}
