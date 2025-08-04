import { useState, useContext } from "react"
import { useNavigate, Link } from "react-router-dom"
import { AuthContext } from "@/contexts/AuthContext"
import { toast } from "react-toastify"
import { FaRegGem } from "react-icons/fa"
import PasswordStrengthMeter from "../components/PasswordStrengthMeter"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      toast.success("Login realizado com sucesso!")
      navigate("/dashboard")
    } catch (error) {
      toast.error("Falha no login. Verifique suas credenciais.")
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
      {/* Bloco do formulário */}
      <div className="flex flex-1 items-center justify-center py-12">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800">Acesse sua conta</h1>
            <p className="mt-2 text-gray-500">Digite seu email para entrar</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="nome@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none text-gray-900 transition"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="font-medium text-gray-700">
                  Senha
                </label>
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none text-gray-900 transition"
              />
              <PasswordStrengthMeter password={password} />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-bold shadow transition disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
          <div className="mt-8 text-center text-sm text-gray-600">
            Não tem uma conta?{" "}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
              Registre-se
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
