import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaBars, FaUserCircle } from 'react-icons/fa'
import { AuthContext } from '../contexts/AuthContext'
import { ThemeContext } from '../contexts/ThemeContext'

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { user, logout } = useContext(AuthContext)
  const { theme } = useContext(ThemeContext)
  const navigate = useNavigate()
  const primary = theme?.primaryColor || '#2563eb'

  const handleLogout = () => {
    logout()
    navigate('/login')
    setDropdownOpen(false)
  }

  return (
    <header
      className="flex items-center justify-between px-6 py-4 border-b shadow-sm"
      style={{
        background: primary,
        borderBottomColor: primary,
      }}
    >
      <div className="flex items-center">
        {/* Menu hamburger para mobile (pode expandir depois) */}
        <button className="text-white focus:outline-none lg:hidden mr-4">
          <FaBars size={22} />
        </button>
        <h1 className="text-2xl font-bold text-white tracking-wide drop-shadow-sm">
          OreFlow
        </h1>
      </div>

      <div className="flex items-center">
        <span className="mr-4 font-medium text-white hidden sm:block">{user?.name}</span>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="relative z-20 block h-10 w-10 rounded-full border-2 border-white shadow hover:ring-2 hover:ring-white transition"
          >
            {user?.photo ? (
              <img src={user.photo} alt="User" className="h-full w-full object-cover rounded-full" />
            ) : (
              <FaUserCircle className="h-full w-full text-white" />
            )}
          </button>

          {/* Fundo para fechar dropdown */}
          {dropdownOpen && (
            <div
              onClick={() => setDropdownOpen(false)}
              className="fixed inset-0 h-full w-full z-10"
            />
          )}

          {/* Dropdown visual */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl z-30 animate-dropdown-fade">
              <Link
                to="/profile"
                className="block px-5 py-3 text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-800 transition"
                onClick={() => setDropdownOpen(false)}
              >
                Editar Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left block px-5 py-3 font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Animação CSS do dropdown */}
      <style>{`
        @keyframes dropdown-fade {
          from { opacity: 0; transform: translateY(-10px);}
          to   { opacity: 1; transform: translateY(0);}
        }
        .animate-dropdown-fade {
          animation: dropdown-fade 0.18s cubic-bezier(.42,.61,.58,1.18);
        }
      `}</style>
    </header>
  )
}
