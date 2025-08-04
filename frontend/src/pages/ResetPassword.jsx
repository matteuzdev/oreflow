import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import { FaRegGem } from 'react-icons/fa';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }

    // Validação da força da senha
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[\W_]/.test(password);
    const isLongEnough = password.length >= 8;

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSymbol || !isLongEnough) {
      toast.error('A nova senha deve atender a todos os critérios de segurança.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/auth/reset-password/${token}`, { password });
      toast.success(response.data.message);
      navigate('/login');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Falha ao redefinir a senha. O link pode ter expirado.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-tr from-gray-50 via-blue-50 to-gray-100">
       <div className="hidden lg:flex flex-col justify-center items-center flex-1 bg-gradient-to-b from-blue-200/50 to-blue-400/30">
        <FaRegGem className="h-20 w-20 text-blue-600 mb-4 drop-shadow" />
        <h2 className="text-4xl font-bold text-gray-800 mb-2">OreFlow</h2>
        <p className="text-lg text-gray-500">
          A plataforma definitiva para gestão de produção industrial.
        </p>
      </div>
      <div className="flex flex-1 items-center justify-center py-12">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Crie uma nova senha
          </h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block font-medium text-gray-700 mb-1">
                Nova Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none text-gray-900 transition"
              />
              <PasswordStrengthMeter password={password} />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block font-medium text-gray-700 mb-1">
                Confirmar Nova Senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none text-gray-900 transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-bold shadow transition disabled:opacity-60"
            >
              {loading ? 'Redefinindo...' : 'Redefinir Senha'}
            </button>
          </form>
           <div className="mt-8 text-center text-sm text-gray-600">
            Lembrou a senha?{' '}
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
  );
}
