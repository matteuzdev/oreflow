import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { FaBoxOpen, FaChartLine, FaUsers } from 'react-icons/fa'

// Card KPI Moderno (interno aqui, mas recomendo criar um arquivo separado depois)
function CardKpi({ title, value, icon, color = "bg-blue-100", iconColor = "text-blue-500" }) {
  return (
    <div className={`flex items-center rounded-2xl shadow-lg px-6 py-5 bg-white transition hover:scale-105 hover:shadow-2xl duration-150`}>
      <div className={`rounded-xl ${color} flex items-center justify-center mr-5 p-4`}>
        <span className={`${iconColor} text-3xl`}>{icon}</span>
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-800">{value}</div>
        <div className="text-gray-500">{title}</div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useContext(AuthContext)

  // Dados fictícios para exibir
  const kpis = {
    producao: '1.250 t',
    vendas: 'R$ 45.800',
    clientes: '78',
  }

  return (
    <div className="p-8 min-h-screen bg-gradient-to-tr from-gray-50 via-blue-50 to-gray-100">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Bem-vindo, {user?.name || 'Usuário'}!
      </h2>
      <p className="mb-8 text-lg text-gray-500">
        Aqui está um resumo da sua operação.
      </p>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <CardKpi
          title="Produção do Mês"
          value={kpis.producao}
          icon={<FaChartLine />}
          color="bg-blue-100"
          iconColor="text-blue-500"
        />
        <CardKpi
          title="Vendas do Mês"
          value={kpis.vendas}
          icon={<FaBoxOpen />}
          color="bg-green-100"
          iconColor="text-green-500"
        />
        <CardKpi
          title="Clientes Ativos"
          value={kpis.clientes}
          icon={<FaUsers />}
          color="bg-purple-100"
          iconColor="text-purple-500"
        />
      </div>

      {/* Gráfico placeholder */}
      <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Evolução das Vendas</h3>
        <div className="w-full h-60 flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-100 to-purple-100">
          <span className="text-gray-400 text-lg">[Gráfico em breve]</span>
        </div>
      </div>
    </div>
  )
}
