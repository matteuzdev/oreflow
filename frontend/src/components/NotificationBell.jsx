// frontend/src/components/NotificationBell.jsx
import { useState, useEffect, useContext } from 'react';
import { FaBell } from 'react-icons/fa';
import { api } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AuthContext);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
    } catch (error) {
      console.error('Falha ao buscar notificações.');
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Busca novas notificações a cada 1 minuto
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const handleToggle = async () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      try {
        await api.post('/notifications/read-all');
        // Atualiza o estado local para refletir que foram lidas
        setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      } catch (error) {
        console.error('Falha ao marcar notificações como lidas.');
      }
    }
  };

  return (
    <div className="relative">
      <button onClick={handleToggle} className="relative text-gray-500 hover:text-gray-700">
        <FaBell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-20">
          <div className="p-4 font-bold border-b">Notificações</div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">Nenhuma notificação ainda.</p>
            ) : (
              notifications.map(n => (
                <div key={n.id} className={`p-4 border-b hover:bg-gray-50 ${!n.is_read ? 'bg-blue-50' : ''}`}>
                  <p className="font-semibold text-gray-800">{n.title}</p>
                  <p className="text-sm text-gray-600">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: ptBR })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
