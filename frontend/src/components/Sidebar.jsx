import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaChartLine,
  FaUsers,
  FaShoppingCart,
  FaCog,
} from 'react-icons/fa'
import { AuthContext } from '../contexts/AuthContext'
import { ThemeContext } from '../contexts/ThemeContext'

const navItems = [
  { text: 'Dashboard', icon: <FaTachometerAlt />, to: '/dashboard' },
  { text: 'Produtos', icon: <FaBoxOpen />, to: '/produtos' },
  { text: 'Produção', icon: <FaChartLine />, to: '/producao' },
  { text: 'Vendas', icon: <FaShoppingCart />, to: '/vendas' },
  { text: 'Clientes', icon: <FaUsers />, to: '/clientes' },
  // Adicionando as duas rotas administrativas
  { text: 'Settings', icon: <FaCog />, to: '/settings', adminOnly: true },
  { text: 'Configurações', icon: <FaCog />, to: '/configuracoes', adminOnly: true },
]

export default function Sidebar() {
  const { isAdmin } = useContext(AuthContext)
  const { theme } = useContext(ThemeContext)
  const primary = theme?.primaryColor || '#2563eb'

  return (
    <div className="hidden lg:block w-64 bg-white shadow-lg min-h-screen border-r border-gray-100">
      <div className="flex items-center justify-center mt-10 mb-6">
        <div className="flex items-center gap-2">
          {theme.logo ? (
            <img src={theme.logo} alt="Logo" className="h-10 w-10 rounded-lg shadow" />
          ) : (
            <span
              className="h-10 w-10 flex items-center justify-center rounded-lg font-bold text-white shadow"
              style={{ background: primary, fontSize: 22 }}
            >
              {theme.name?.[0] || 'O'}
            </span>
          )}
          <span className="text-2xl font-semibold" style={{ color: primary }}>
            {theme.name || 'OreFlow'}
          </span>
        </div>
      </div>
      <nav className="mt-8 px-2">
        {navItems.map((item) => {
          if (item.adminOnly && !isAdmin) return null
          return (
            <NavLink
              key={item.text}
              to={item.to}
              className={({ isActive }) =>
                [
                  'flex items-center px-4 py-3 mb-2 text-base font-medium rounded-xl transition-all gap-3',
                  // A classe `bg-[${primary}]` foi removida pois não funciona. O estilo inline abaixo já faz o trabalho.
                  isActive
                    ? `text-white shadow`
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                ].join(' ')
              }
              style={({ isActive }) =>
                isActive
                  ? { background: primary, color: '#fff' }
                  : {}
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.text}</span>
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}
