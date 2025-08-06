import { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'
import { api } from '../services/api'
import { toast } from 'react-toastify'
import Modal from '../components/Modal'
import ProductionForm from '../components/ProductionForm'

export default function Producao() {
  const [production, setProduction] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduction, setSelectedProduction] = useState(null)

  async function fetchProduction() {
    setLoading(true)
    try {
      const response = await api.get('/production')
      setProduction(response.data)
    } catch (error) {
      toast.error('Falha ao carregar produção.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProduction()
  }, [])

  const handleOpenModal = (prod = null) => {
    setSelectedProduction(prod)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setSelectedProduction(null)
    setIsModalOpen(false)
  }

  const handleFormSubmit = async (data) => {
    try {
      if (selectedProduction) {
        await api.put(`/production/${selectedProduction.id}`, data)
        toast.success('Registro de produção atualizado com sucesso!')
      } else {
        await api.post('/production', data)
        toast.success('Registro de produção criado com sucesso!')
      }
      fetchProduction()
      handleCloseModal()
    } catch (error) {
      toast.error('Falha ao salvar registro de produção.')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este registro?')) {
      try {
        await api.delete(`/production/${id}`)
        toast.success('Registro de produção deletado com sucesso!')
        fetchProduction()
      } catch (error) {
        toast.error('Falha ao deletar registro de produção.')
      }
    }
  }

  return (
    <div className="p-8 min-h-screen bg-gradient-to-tr from-gray-50 via-blue-50 to-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Produção</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow transition"
        >
          <FaPlus />
          Novo Registro
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-left">Data</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-left">Produto</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-left">Quantidade</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-left">Unidade</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400">Carregando...</td>
              </tr>
            ) : production.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400">Nenhum registro de produção cadastrado.</td>
              </tr>
            ) : (
              production.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-gray-800 font-medium">{new Date(p.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{p.product_name}</td>
                  <td className="px-6 py-4">{p.quantity}</td>
                  <td className="px-6 py-4">{p.unit}</td>
                  <td className="px-6 py-4 text-center flex justify-center gap-2">
                    <button
                      onClick={() => handleOpenModal(p)}
                      className="text-yellow-500 hover:bg-yellow-50 rounded-full p-2 transition"
                      title="Editar"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
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
        title={selectedProduction ? 'Editar Registro' : 'Novo Registro'}
      >
        <ProductionForm
          production={selectedProduction}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  )
}
