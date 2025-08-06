// frontend/src/components/NotificationSender.jsx
import { useState, useContext } from 'react';
import { api } from '../services/api';
import { toast } from 'react-toastify';
import { ThemeContext } from '../contexts/ThemeContext';

export default function NotificationSender() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme } = useContext(ThemeContext);
  const primary = theme?.primaryColor || '#2563eb';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/notifications/admin', { title, message });
      toast.success('Notificação enviada com sucesso!');
      setTitle('');
      setMessage('');
    } catch (error) {
      toast.error('Falha ao enviar notificação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-2xl font-bold mb-8" style={{ color: primary }}>
        Enviar Notificação para Usuários
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold mb-1 text-gray-700">
            Título
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-semibold mb-1 text-gray-700">
            Mensagem
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows="4"
            className="mt-1 block w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
          ></textarea>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 text-sm font-bold text-white rounded-lg shadow transition disabled:opacity-60"
            style={{ background: primary }}
          >
            {loading ? 'Enviando...' : 'Enviar Notificação'}
          </button>
        </div>
      </form>
    </div>
  );
}
