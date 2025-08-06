import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { FaRegGem } from 'react-icons/fa';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/forgot-password', { email });
      toast.info(response.data.message);
    } catch (error) {
      toast.error('Ocorreu um erro. Tente novamente.');
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
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Esqueceu sua senha?
          </h1>
          <p className="text-center text-gray-500 mb-6">
            Sem problemas. Digite seu email e enviaremos um link para você criar uma nova.
          </p>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none text-gray-900 transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-bold shadow transition disabled:opacity-60"
            >
              {loading ? 'Enviando...' : 'Enviar Link de Redefinição'}
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
