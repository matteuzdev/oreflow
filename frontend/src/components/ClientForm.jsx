import { useState, useEffect, useContext } from 'react'
import { ThemeContext } from '../contexts/ThemeContext'

export default function ClientForm({ client, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    email: '',
    phone: '',
    address: '',
    type: 'cliente',
  });
  const { theme } = useContext(ThemeContext)
  const primary = theme?.primaryColor || '#2563eb'

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        cnpj: client.cnpj || '',
        email: client.email || '',
        phone: client.phone || '',
        address: client.address || '',
        type: client.type || 'cliente',
      })
    } else {
      setFormData({
        name: '',
        cnpj: '',
        email: '',
        phone: '',
        address: '',
        type: 'cliente',
      })
    }
  }, [client])

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-semibold mb-1" style={{ color: primary }}>
          Nome / Razão Social
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="block w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none transition"
          style={{ borderColor: primary, boxShadow: `0 0 0 1.5px ${primary}22` }}
        />
      </div>
      <div>
        <label htmlFor="cnpj" className="block text-sm font-semibold mb-1" style={{ color: primary }}>
          CNPJ
        </label>
        <input
          type="text"
          id="cnpj"
          value={formData.cnpj}
          onChange={handleChange}
          className="block w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none transition"
          style={{ borderColor: primary, boxShadow: `0 0 0 1.5px ${primary}22` }}
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-semibold mb-1" style={{ color: primary }}>
          Email
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          className="block w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none transition"
          style={{ borderColor: primary, boxShadow: `0 0 0 1.5px ${primary}22` }}
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-semibold mb-1" style={{ color: primary }}>
          Telefone
        </label>
        <input
          type="text"
          id="phone"
          value={formData.phone}
          onChange={handleChange}
          className="block w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none transition"
          style={{ borderColor: primary, boxShadow: `0 0 0 1.5px ${primary}22` }}
        />
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-semibold mb-1" style={{ color: primary }}>
          Endereço
        </label>
        <input
          type="text"
          id="address"
          value={formData.address}
          onChange={handleChange}
          className="block w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none transition"
          style={{ borderColor: primary, boxShadow: `0 0 0 1.5px ${primary}22` }}
        />
      </div>
      <div>
        <label htmlFor="type" className="block text-sm font-semibold mb-1" style={{ color: primary }}>
          Tipo
        </label>
        <select
          id="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="block w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none transition"
          style={{ borderColor: primary, boxShadow: `0 0 0 1.5px ${primary}22` }}
        >
          <option value="cliente">Cliente</option>
          <option value="fornecedor">Fornecedor</option>
        </select>
      </div>
      <div className="flex justify-end pt-4">
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
          Salvar
        </button>
      </div>
    </form>
  )
}
