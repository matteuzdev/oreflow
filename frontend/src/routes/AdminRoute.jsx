import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

export default function AdminRoute({ children }) {
  const { isAdmin, loading } = useContext(AuthContext)

  if (loading) {
    return <div>Loading...</div> // Or a spinner component
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" /> // Redirect to a safe page
  }

  return children ? children : <Outlet />;
}
