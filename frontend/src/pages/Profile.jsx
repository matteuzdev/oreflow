import { useState, useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { api } from '../services/api'
import { toast } from 'react-toastify'

export default function Profile() {
  const { user, setUser } = useContext(AuthContext)
  const [name, setName] = useState(user?.name || '')
  const [photo, setPhoto] = useState(user?.photo || '')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.put('/users/profile', { name, photo })
      setUser(data.user)
      localStorage.setItem('@OreFlow:user', JSON.stringify(data.user))
      toast.success('Perfil atualizado com sucesso!')
    } catch (error) {
      toast.error('Falha ao atualizar o perfil.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 min-h-screen bg-gradient-to-tr from-gray-50 via-blue-50 to-gray-100 flex justify-center items-center">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Editar Perfil</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 shadow mb-2">
              {photo ? (
                <img
                  src={photo}
                  alt="Foto de perfil"
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="flex items-center justify-center w-full h-full text-4xl text-gray-300">?</span>
              )}
            </div>
            <span className="text-sm text-gray-500">Cole a URL de uma foto abaixo para alterar</span>
          </div>
          <div>
            <label htmlFor="name" className="block font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none text-gray-900 transition"
            />
          </div>
          <div>
            <label htmlFor="photo" className="block font-medium text-gray-700 mb-1">URL da Foto</label>
            <input
              type="text"
              id="photo"
              value={photo}
              onChange={e => setPhoto(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none text-gray-900 transition"
            />
          </div>
          <div>
            <label htmlFor="email" className="block font-medium text-gray-700 mb-1">Email (não pode ser alterado)</label>
            <input
              type="email"
              id="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-bold shadow transition disabled:opacity-60"
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </div>
    </div>
  )
}
