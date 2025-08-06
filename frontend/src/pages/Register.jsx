import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { api } from '../services/api'
import { FaRegGem } from "react-icons/fa"
import PasswordStrengthMeter from '../components/PasswordStrengthMeter'

export default function Register() {
  const [formData, setFormData] = useState({
    company_name: '',
    cnpj: '',
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validação da força da senha
    const { password } = formData;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[\W_]/.test(password);
    const isLongEnough = password.length >= 8;

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSymbol || !isLongEnough) {
      toast.error('A senha deve atender a todos os critérios de segurança.');
      return;
    }

    setLoading(true)
    try {
      await api.post('/auth/register', formData)
      toast.success('Registro realizado com sucesso! Faça o login.')
      navigate('/login')
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Falha no registro. Verifique os dados.'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-tr from-gray-50 via-blue-50 to-gray-100">
      {/* Bloco da Logo e frase */}
      <div className="hidden lg:flex flex-col justify-center items-center flex-1 bg-gradient-to-b from-blue-200/50 to-blue-400/30">
        <FaRegGem className="h-20 w-20 text-blue-600 mb-4 drop-shadow" />
        <h2 className="text-4xl font-bold text-gray-800 mb-2">OreFlow</h2>
        <p className="text-lg text-gray-500">
          A plataforma definitiva para gestão de produção industrial.
        </p>
      </div>
      {/* Formulário */}
      <div className="flex flex-1 items-center justify-center py-12">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Criar Conta no OreFlow
          </h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="company_name" className="block font-medium text-gray-700 mb-1">
                Nome da Empresa
              </label>
              <input
                id="company_name"
                type="text"
                value={formData.company_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none text-gray-900 transition"
              />
            </div>
            <div>
              <label htmlFor="cnpj" className="block font-medium text-gray-700 mb-1">
                CNPJ
              </label>
              <input
                id="cnpj"
                type="text"
                value={formData.cnpj}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none text-gray-900 transition"
              />
            </div>
            <div>
              <label htmlFor="name" className="block font-medium text-gray-700 mb-1">
                Seu Nome
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none text-gray-900 transition"
              />
            </div>
            <div>
              <label htmlFor="email" className="block font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none text-gray-900 transition"
              />
            </div>
            <div>
              <label htmlFor="password" className="block font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none text-gray-900 transition"
              />
              <PasswordStrengthMeter password={formData.password} />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-bold shadow transition disabled:opacity-60"
            >
              {loading ? 'Registrando...' : 'Registrar'}
            </button>
          </form>
          <div className="mt-8 text-center text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Faça o login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
