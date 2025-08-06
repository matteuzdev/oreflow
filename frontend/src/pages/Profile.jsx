import { useState, useContext, useRef } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { api } from '../services/api'
import { toast } from 'react-toastify'
import { FaCamera, FaEye, FaEyeSlash } from 'react-icons/fa'
import PasswordStrengthMeter from '../components/PasswordStrengthMeter'

// Componente para o formulário de alteração de senha
const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('A nova senha e a confirmação não coincidem.');
      return;
    }
    
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSymbol = /[\W_]/.test(newPassword);
    const isLongEnough = newPassword.length >= 8;

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSymbol || !isLongEnough) {
      toast.error('A nova senha deve atender a todos os critérios de segurança.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.put('/users/profile/change-password', { currentPassword, newPassword });
      toast.success(data.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Falha ao alterar a senha.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-10 pt-6 border-t">
       <h3 className="text-xl font-bold text-gray-800 text-center">Alterar Senha</h3>
      <div>
        <label htmlFor="currentPassword"className="block font-medium text-gray-700 mb-1">Senha Atual</label>
        <div className="relative">
          <input
            id="currentPassword"
            type={showCurrent ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none text-gray-900 transition"
          />
          <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500">
            {showCurrent ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>
      <div>
        <label htmlFor="newPassword"className="block font-medium text-gray-700 mb-1">Nova Senha</label>
        <div className="relative">
          <input
            id="newPassword"
            type={showNew ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none text-gray-900 transition"
          />
          <button type="button" onClick={() => setShowNew(!showNew)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500">
            {showNew ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <PasswordStrengthMeter password={newPassword} />
      </div>
       <div>
        <label htmlFor="confirmPassword"className="block font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
        <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none text-gray-900 transition"
        />
      </div>
      <button type="submit" disabled={loading} className="w-full py-3 bg-gray-700 hover:bg-gray-800 rounded-lg text-white font-bold shadow transition disabled:opacity-60">
        {loading ? 'Salvando...' : 'Alterar Senha'}
      </button>
    </form>
  );
};


export default function Profile() {
  const { user, setUser } = useContext(AuthContext)
  const [formState, setFormState] = useState({
    name: user?.name || '',
    photo_url: user?.photo_url || '',
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)
    setUploading(true)
    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setFormState(prev => ({ ...prev, photo_url: data.secure_url }))
      toast.success('Foto enviada com sucesso!')
    } catch (error) {
      toast.error('Falha ao enviar a foto.')
    } finally {
      setUploading(false)
    }
  }

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormState(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.put('/users/profile', {
        name: formState.name,
        photo_url: formState.photo_url,
      })
      
      const updatedUser = { ...user, name: data.name, photo_url: data.photo_url }
      setUser(updatedUser)
      localStorage.setItem('@OreFlow:user', JSON.stringify(updatedUser))

      toast.success('Perfil atualizado com sucesso!')
    } catch (error) {
      toast.error('Falha ao atualizar o perfil.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 min-h-screen bg-gradient-to-tr from-gray-50 via-blue-50 to-gray-100 flex justify-center items-start">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-10 my-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Editar Perfil</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 shadow mb-2">
                {formState.photo_url ? (
                  <img src={formState.photo_url} alt="Foto de perfil" className="object-cover w-full h-full" />
                ) : (
                  <span className="flex items-center justify-center w-full h-full text-4xl text-gray-300">?</span>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                disabled={uploading}
                className="absolute bottom-2 right-0 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
                title="Alterar foto"
              >
                {uploading ? <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div> : <FaCamera className="text-gray-600" />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="name" className="block font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              id="name"
              value={formState.name}
              onChange={handleChange}
              required
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
            disabled={loading || uploading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-bold shadow transition disabled:opacity-60"
          >
            {loading ? 'Salvando...' : 'Salvar Alterações de Perfil'}
          </button>
        </form>

        <ChangePasswordForm />
      </div>
    </div>
  )
}
