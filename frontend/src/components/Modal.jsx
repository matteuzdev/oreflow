import { useContext } from 'react'
import { ThemeContext } from '../contexts/ThemeContext'

export default function Modal({ isOpen, onClose, title, children }) {
  const { theme } = useContext(ThemeContext)
  const primary = theme?.primaryColor || '#2563eb'

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 backdrop-blur-sm transition-all">
      <div
        className="relative w-full max-w-lg mx-auto bg-white rounded-2xl shadow-2xl p-6 md:p-8 animate-fade-in"
        style={{ borderTop: `6px solid ${primary}` }}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold" style={{ color: primary }}>{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100 transition text-xl"
            aria-label="Fechar"
            tabIndex={0}
          >
            <span aria-hidden="true" className="font-bold text-gray-500 hover:text-gray-700" style={{ fontSize: 28 }}>
              &times;
            </span>
          </button>
        </div>
        <div>{children}</div>
      </div>
      {/* Animação de entrada */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(24px);}
          to   { opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in {
          animation: fade-in 0.22s cubic-bezier(.29,.79,.4,1.13);
        }
      `}</style>
    </div>
  )
}
