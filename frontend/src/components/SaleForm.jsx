import { useState, useEffect, useContext } from 'react'
import { api } from '../services/api'
import { toast } from 'react-toastify'
import { ThemeContext } from '../contexts/ThemeContext'

export default function SaleForm({ sale, onSubmit, onCancel }) {
  const [products, setProducts] = useState([])
  const [clients, setClients] = useState([])

  const [product_id, setProductId] = useState('')
  const [client_id, setClientId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [value, setValue] = useState('')
  const [date, setDate] = useState('')
  const [type, setType] = useState('venda')

  const { theme } = useContext(ThemeContext)
  const primary = theme?.primaryColor || '#2563eb'

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, clientsRes] = await Promise.all([
          api.get('/products'),
          api.get('/clients'),
        ])
        setProducts(productsRes.data)
        setClients(clientsRes.data)
      } catch (error) {
        toast.error('Falha ao carregar dados para o formulário.')
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (sale) {
      setProductId(sale.product_id)
      setClientId(sale.client_id)
      setQuantity(sale.quantity)
      setValue(sale.value)
      setDate(new Date(sale.date).toISOString().split('T')[0])
      setType(sale.type)
    } else {
      setProductId('')
      setClientId('')
      setQuantity('')
      setValue('')
      setDate(new Date().toISOString().split('T')[0])
      setType('venda')
    }
  }, [sale])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      product_id,
      client_id,
      quantity: Number(quantity),
      value: Number(value),
      date,
      type,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <label htmlFor="product" className="block text-sm font-medium mb-1" style={{ color: primary }}>
            Produto
          </label>
          <select
            id="product"
            value={product_id}
            onChange={(e) => setProductId(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none transition"
            style={{ borderColor: primary, boxShadow: `0 0 0 1.5px ${primary}22` }}
          >
            <option value="" disabled>Selecione</option>
            {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="client" className="block text-sm font-medium mb-1" style={{ color: primary }}>
            Cliente/Fornecedor
          </label>
          <select
            id="client"
            value={client_id}
            onChange={(e) => setClientId(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none transition"
            style={{ borderColor: primary, boxShadow: `0 0 0 1.5px ${primary}22` }}
          >
            <option value="" disabled>Selecione</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.type})</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="quantity" className="block text-sm font-medium mb-1" style={{ color: primary }}>
            Quantidade
          </label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none transition"
            style={{ borderColor: primary, boxShadow: `0 0 0 1.5px ${primary}22` }}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="value" className="block text-sm font-medium mb-1" style={{ color: primary }}>
            Valor (R$)
          </label>
          <input
            type="number"
            id="value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none transition"
            style={{ borderColor: primary, boxShadow: `0 0 0 1.5px ${primary}22` }}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="date" className="block text-sm font-medium mb-1" style={{ color: primary }}>
            Data
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none transition"
            style={{ borderColor: primary, boxShadow: `0 0 0 1.5px ${primary}22` }}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="type" className="block text-sm font-medium mb-1" style={{ color: primary }}>
            Tipo
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none transition"
            style={{ borderColor: primary, boxShadow: `0 0 0 1.5px ${primary}22` }}
          >
            <option value="venda">Venda</option>
            <option value="compra">Compra</option>
          </select>
        </div>
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
          Salvar
        </button>
      </div>
    </form>
  )
}
