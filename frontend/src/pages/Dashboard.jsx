import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { FaBoxOpen, FaChartLine, FaUsers } from 'react-icons/fa'
import { api } from '../services/api'
import { toast } from 'react-toastify'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Card KPI
function CardKpi({ title, value, icon, color = "bg-blue-100", iconColor = "text-blue-500" }) {
  return (
    <div className="flex items-center rounded-2xl shadow-lg px-6 py-5 bg-white transition hover:scale-105 hover:shadow-2xl duration-150">
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
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSummary() {
      try {
        const { data } = await api.get('/dashboard/summary')
        setSummary(data)
      } catch (error) {
        toast.error("Falha ao carregar o resumo do dashboard.")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchSummary()
  }, [])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }
  
  const formatMonth = (monthStr) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleString('pt-BR', { month: 'short' });
  }

  if (loading) {
    return <div className="p-8 text-center">Carregando...</div>
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
          value={`${summary?.production_total || 0} t`}
          icon={<FaChartLine />}
          color="bg-blue-100"
          iconColor="text-blue-500"
        />
        <CardKpi
          title="Vendas do Mês"
          value={formatCurrency(summary?.sales_total || 0)}
          icon={<FaBoxOpen />}
          color="bg-green-100"
          iconColor="text-green-500"
        />
        <CardKpi
          title="Clientes Ativos"
          value={summary?.clients_total || 0}
          icon={<FaUsers />}
          color="bg-purple-100"
          iconColor="text-purple-500"
        />
      </div>

      {/* Gráfico */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Evolução das Vendas (Últimos 6 meses)</h3>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summary?.sales_chart_data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickFormatter={formatMonth} />
              <YAxis tickFormatter={value => new Intl.NumberFormat("pt-BR", { notation: "compact", compactDisplay: "short" }).format(value)} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend formatter={() => 'Vendas'} />
              <Bar dataKey="total_sales" fill="#34d399" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}