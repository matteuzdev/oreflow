import { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'
import { api } from '../services/api'
import { toast } from 'react-toastify'
import Modal from '../components/Modal'
import ProductForm from '../components/ProductForm'

export default function Produtos() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  async function fetchProducts() {
    setLoading(true)
    try {
      const response = await api.get('/products')
      setProducts(response.data)
    } catch (error) {
      toast.error('Falha ao carregar produtos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleOpenModal = (product = null) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setSelectedProduct(null)
    setIsModalOpen(false)
  }

  const handleFormSubmit = async (data) => {
    try {
      if (selectedProduct) {
        await api.put(`/products/${selectedProduct.id}`, data)
        toast.success('Produto atualizado com sucesso!')
      } else {
        await api.post('/products', data)
        toast.success('Produto criado com sucesso!')
      }
      fetchProducts()
      handleCloseModal()
    } catch (error) {
      toast.error('Falha ao salvar produto.')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este produto?')) {
      try {
        await api.delete(`/products/${id}`)
        toast.success('Produto deletado com sucesso!')
        fetchProducts()
      } catch (error) {
        toast.error('Falha ao deletar produto.')
      }
    }
  }

  return (
    <div className="p-8 min-h-screen bg-gradient-to-tr from-gray-50 via-blue-50 to-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Produtos</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow transition"
        >
          <FaPlus />
          Novo Produto
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-left">Nome</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-left">Unidade</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={3} className="py-8 text-center text-gray-400">Carregando...</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-8 text-center text-gray-400">Nenhum produto cadastrado.</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-800">{product.name}</td>
                  <td className="px-6 py-4">{product.unit}</td>
                  <td className="px-6 py-4 text-center flex justify-center gap-2">
                    <button
                      onClick={() => handleOpenModal(product)}
                      className="text-yellow-500 hover:bg-yellow-50 rounded-full p-2 transition"
                      title="Editar"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-500 hover:bg-red-50 rounded-full p-2 transition"
                      title="Excluir"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedProduct ? 'Editar Produto' : 'Novo Produto'}
      >
        <ProductForm
          product={selectedProduct}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  )
}
