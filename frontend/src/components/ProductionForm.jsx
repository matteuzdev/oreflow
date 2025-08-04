import { useState, useEffect, useContext } from 'react'
import { api } from '../services/api'
import { toast } from 'react-toastify'
import { ThemeContext } from '../contexts/ThemeContext'

export default function ProductionForm({ production, onSubmit, onCancel }) {
  const [products, setProducts] = useState([])
  const [product_id, setProductId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [date, setDate] = useState('')

  const { theme } = useContext(ThemeContext)
  const primary = theme?.primaryColor || '#2563eb'

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await api.get('/products')
        setProducts(response.data)
      } catch (error) {
        toast.error('Falha ao carregar produtos para o formulário.')
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    if (production) {
      setProductId(production.product_id)
      setQuantity(production.quantity)
      setDate(new Date(production.date).toISOString().split('T')[0])
    } else {
      setProductId('')
      setQuantity('')
      setDate(new Date().toISOString().split('T')[0])
    }
  }, [production])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ product_id, quantity: Number(quantity), date })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="product" className="block text-sm font-medium mb-1" style={{ color: primary }}>
            Produto
          </label>
          <select
            id="product"
            value={product_id}
            onChange={e => setProductId(e.target.value)}
            required
            className="block w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
            style={{ borderColor: primary, boxShadow: `0 0 0 1.5px ${primary}22` }}
          >
            <option value="" disabled>Selecione um produto</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium mb-1" style={{ color: primary }}>
            Quantidade
          </label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            required
            className="block w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
            style={{ borderColor: primary, boxShadow: `0 0 0 1.5px ${primary}22` }}
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium mb-1" style={{ color: primary }}>
            Data
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            className="block w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
            style={{ borderColor: primary, boxShadow: `0 0 0 1.5px ${primary}22` }}
          />
        </div>
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
