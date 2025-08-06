import { Routes, Route, Navigate, Outlet } from 'react-router-dom'

import PrivateRoute from './PrivateRoute'
import AdminRoute from './AdminRoute'
import Layout from '../components/Layout'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import Produtos from '../pages/Produtos'
import Producao from '../pages/Producao'
import Vendas from '../pages/Vendas'
import Clientes from '../pages/Clientes'
import Profile from '../pages/Profile'
import Gestao from '../pages/Gestao'

import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'

function AppLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      
      <Route 
        path="/" 
        element={<PrivateRoute><AppLayout /></PrivateRoute>}
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="produtos" element={<Produtos />} />
        <Route path="producao" element={<Producao />} />
        <Route path="vendas" element={<Vendas />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="profile" element={<Profile />} />
        <Route path="gestao" element={<AdminRoute><Gestao /></AdminRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
