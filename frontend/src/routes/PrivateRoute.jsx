import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

export default function PrivateRoute({ children }) {
  const { signed, loading } = useContext(AuthContext)

  if (loading) {
    return <div>Loading...</div> // Or a spinner component
  }

  if (!signed) {
    return <Navigate to="/login" />
  }

  return children
}
