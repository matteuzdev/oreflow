import { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'
import { api } from '../services/api'
import { toast } from 'react-toastify'
import Modal from '../components/Modal'
import SaleForm from '../components/SaleForm'

export default function Vendas() {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSale, setSelectedSale] = useState(null)

  async function fetchSales() {
    setLoading(true)
    try {
      const response = await api.get('/sales')
      setSales(response.data)
    } catch (error) {
      toast.error('Falha ao carregar vendas.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSales()
  }, [])

  const handleOpenModal = (sale = null) => {
    setSelectedSale(sale)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setSelectedSale(null)
    setIsModalOpen(false)
  }

  const handleFormSubmit = async (data) => {
    try {
      if (selectedSale) {
        await api.put(`/sales/${selectedSale.id}`, data)
        toast.success('Registro de venda/compra atualizado com sucesso!')
      } else {
        await api.post('/sales', data)
        toast.success('Registro de venda/compra criado com sucesso!')
      }
      fetchSales()
      handleCloseModal()
    } catch (error) {
      toast.error('Falha ao salvar registro.')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este registro?')) {
      try {
        await api.delete(`/sales/${id}`)
        toast.success('Registro deletado com sucesso!')
        fetchSales()
      } catch (error) {
        toast.error('Falha ao deletar registro.')
      }
    }
  }

  return (
    <div className="p-8 min-h-screen bg-gradient-to-tr from-gray-50 via-blue-50 to-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Vendas e Compras</h2>
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
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-left">Qtd</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-left">Valor</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-left">Cliente/Fornecedor</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-left">Tipo</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-400">Carregando...</td>
              </tr>
            ) : sales.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-400">Nenhum registro encontrado.</td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{new Date(sale.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{sale.product_name}</td>
                  <td className="px-6 py-4">{sale.quantity}</td>
                  <td className="px-6 py-4">{`R$ ${Number(sale.value).toFixed(2)}`}</td>
                  <td className="px-6 py-4">{sale.client_name}</td>
                  <td className="px-6 py-4 capitalize">{sale.type}</td>
                  <td className="px-6 py-4 text-center flex justify-center gap-2">
                    <button onClick={() => handleOpenModal(sale)} className="text-yellow-500 hover:bg-yellow-50 rounded-full p-2 transition" title="Editar">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(sale.id)} className="text-red-500 hover:bg-red-50 rounded-full p-2 transition" title="Excluir">
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
        title={selectedSale ? 'Editar Registro' : 'Novo Registro'}
      >
        <SaleForm
          sale={selectedSale}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  )
}
