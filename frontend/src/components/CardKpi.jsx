import { useContext } from 'react'
import { ThemeContext } from '../contexts/ThemeContext'

export default function CardKpi({ title, value, icon }) {
  const { theme } = useContext(ThemeContext)
  const primary = theme?.primaryColor || '#2563eb'

  return (
    <div
      className="bg-white rounded-2xl shadow-lg flex items-center px-6 py-5 gap-4 min-h-[92px] animate-kpi"
      style={{
        borderLeft: `6px solid ${primary}`,
        boxShadow: `0 2px 12px 0 ${primary}11`,
      }}
    >
      <div className="flex items-center justify-center text-4xl" style={{ color: primary }}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold mb-1 text-gray-500 tracking-wide">{title}</p>
        <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      </div>
      {/* Animação de entrada */}
      <style>{`
        @keyframes kpi {
          from { opacity: 0; transform: scale(.98) translateY(14px);}
          to   { opacity: 1; transform: scale(1) translateY(0);}
        }
        .animate-kpi {
          animation: kpi .24s cubic-bezier(.33,1.02,.46,1.1);
        }
      `}</style>
    </div>
  )
}
