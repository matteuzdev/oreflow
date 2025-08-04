import { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'
import { api } from '../services/api'
import { toast } from 'react-toastify'
import Modal from '../components/Modal'
import ClientForm from '../components/ClientForm'

export default function Clientes() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)

  async function fetchClients() {
    setLoading(true)
    try {
      const response = await api.get('/clients')
      setClients(response.data)
    } catch (error) {
      toast.error('Falha ao carregar clientes.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  const handleOpenModal = (client = null) => {
    setSelectedClient(client)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setSelectedClient(null)
    setIsModalOpen(false)
  }

  const handleFormSubmit = async (data) => {
    try {
      if (selectedClient) {
        await api.put(`/clients/${selectedClient.id}`, data)
        toast.success('Cliente atualizado com sucesso!')
      } else {
        await api.post('/clients', data)
        toast.success('Cliente criado com sucesso!')
      }
      fetchClients()
      handleCloseModal()
    } catch (error) {
      toast.error('Falha ao salvar cliente.')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este cliente?')) {
      try {
        await api.delete(`/clients/${id}`)
        toast.success('Cliente deletado com sucesso!')
        fetchClients()
      } catch (error) {
        toast.error('Falha ao deletar cliente.')
      }
    }
  }

  return (
    <div className="p-8 min-h-screen bg-gradient-to-tr from-gray-50 via-blue-50 to-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Clientes e Fornecedores</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition gap-2"
        >
          <FaPlus />
          Novo
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-left">Nome / Razão Social</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-left">CNPJ</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-left">Email</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-left">Telefone</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-left">Tipo</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400">Carregando...</td>
              </tr>
            ) : clients.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400">Nenhum cliente cadastrado.</td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-800">{client.name}</td>
                  <td className="px-6 py-4">{client.cnpj || '-'}</td>
                  <td className="px-6 py-4">{client.email || '-'}</td>
                  <td className="px-6 py-4">{client.phone || '-'}</td>
                  <td className="px-6 py-4 capitalize">{client.type}</td>
                  <td className="px-6 py-4 text-center flex justify-center gap-2">
                    <button
                      onClick={() => handleOpenModal(client)}
                      className="text-yellow-500 hover:bg-yellow-50 rounded-full p-2 transition"
                      title="Editar"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
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
        title={selectedClient ? 'Editar Cliente/Fornecedor' : 'Novo Cliente/Fornecedor'}
      >
        <ClientForm
          client={selectedClient}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  )
}
