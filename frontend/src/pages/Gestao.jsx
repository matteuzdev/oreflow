import { useState } from 'react'
import AppearanceForm from '../components/AppearanceForm'
import UserManagement from '../components/UserManagement'
import NotificationSender from '../components/NotificationSender' // Importando o novo componente

export default function Gestao() {
  const [activeTab, setActiveTab] = useState('appearance')

  return (
    <div className="p-8 min-h-screen bg-gradient-to-tr from-gray-50 via-blue-50 to-gray-100 flex justify-center items-start">
      <div className="w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Gestão da Organização
        </h2>
        
        <div className="mb-8 flex justify-center">
          <nav className="flex rounded-xl shadow-sm bg-white overflow-hidden border">
            <button
              onClick={() => setActiveTab('appearance')}
              className={`px-8 py-3 text-sm font-semibold transition focus:outline-none ${
                activeTab === 'appearance'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-blue-50'
              }`}
            >
              Aparência
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-8 py-3 text-sm font-semibold transition focus:outline-none ${
                activeTab === 'users'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-blue-50'
              }`}
            >
              Usuários
            </button>
            <button
              onClick={() => setActiveTab('communication')}
              className={`px-8 py-3 text-sm font-semibold transition focus:outline-none ${
                activeTab === 'communication'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-blue-50'
              }`}
            >
              Comunicação
            </button>
            {/* A aba de configurações pode ser adicionada depois se necessário */}
          </nav>
        </div>

        <div className="bg-white p-10 rounded-2xl shadow-lg">
          {activeTab === 'appearance' && <AppearanceForm />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'communication' && <NotificationSender />}
        </div>
      </div>
    </div>
  )
}
