import { useState, useEffect, useContext } from 'react'
import { api } from '../services/api'
import { toast } from 'react-toastify'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'
import Modal from './Modal'
import UserForm from './UserForm'
import { ThemeContext } from '../contexts/ThemeContext'

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const { theme } = useContext(ThemeContext)
  const primary = theme?.primaryColor || '#2563eb'

  async function fetchUsers() {
    setLoading(true)
    try {
      const response = await api.get('/admin/users')
      setUsers(response.data)
    } catch (error) {
      toast.error('Falha ao carregar usuários.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleOpenModal = (user = null) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setSelectedUser(null)
    setIsModalOpen(false)
  }

  const handleFormSubmit = async (data) => {
    try {
      if (selectedUser) {
        await api.put(`/admin/users/${selectedUser.id}`, data)
        toast.success('Usuário atualizado com sucesso!')
      } else {
        await api.post('/admin/users/invite', data)
        toast.success('Convite enviado com sucesso!')
      }
      fetchUsers()
      handleCloseModal()
    } catch (error) {
      toast.error('Falha ao salvar usuário.')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja remover este usuário?')) {
      try {
        await api.delete(`/admin/users/${id}`)
        toast.success('Usuário removido com sucesso!')
        fetchUsers()
      } catch (error) {
        toast.error('Falha ao remover usuário.')
      }
    }
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold" style={{ color: primary }}>Gerenciamento de Usuários</h3>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl text-white font-semibold shadow transition"
          style={{ background: primary }}
        >
          <FaPlus />
          Convidar Usuário
        </button>
      </div>
      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-left">Nome</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-left">Email</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-left">Cargo</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-400">Carregando...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-400">Nenhum usuário encontrado.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-800">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4 capitalize">{user.role}</td>
                  <td className="px-6 py-4 text-center flex justify-center gap-2">
                    <button
                      onClick={() => handleOpenModal(user)}
                      className="text-yellow-500 hover:bg-yellow-50 rounded-full p-2 transition"
                      title="Editar"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
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
        title={selectedUser ? 'Editar Usuário' : 'Convidar Usuário'}
      >
        <UserForm user={selectedUser} onSubmit={handleFormSubmit} onCancel={handleCloseModal} />
      </Modal>
    </div>
  )
}
