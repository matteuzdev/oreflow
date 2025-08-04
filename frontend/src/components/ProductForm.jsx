import { useState, useEffect, useContext } from 'react'
import { ThemeContext } from '../contexts/ThemeContext'

export default function ProductForm({ product, onSubmit, onCancel }) {
  const [name, setName] = useState('')
  const [unit, setUnit] = useState('')
  const { theme } = useContext(ThemeContext)
  const primary = theme?.primaryColor || '#2563eb'

  useEffect(() => {
    if (product) {
      setName(product.name)
      setUnit(product.unit)
    } else {
      setName('')
      setUnit('')
    }
  }, [product])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ name, unit })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium mb-1" style={{ color: primary }}>
          Nome do Produto
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="block w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none transition"
          style={{ borderColor: primary, boxShadow: `0 0 0 1.5px ${primary}22` }}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="unit" className="block text-sm font-medium mb-1" style={{ color: primary }}>
          Unidade <span className="text-xs text-gray-400">(ex: kg, ton, g)</span>
        </label>
        <input
          type="text"
          id="unit"
          value={unit}
          onChange={e => setUnit(e.target.value)}
          required
          className="block w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none transition"
          style={{ borderColor: primary, boxShadow: `0 0 0 1.5px ${primary}22` }}
        />
      </div>
      <div className="flex justify-end mt-8">
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
