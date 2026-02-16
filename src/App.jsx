
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import Pedidos from '@/pages/Pedidos';
import OrdemServico from '@/pages/OrdemServico';
import OrdemServicoNew from '@/pages/OrdemServicoNew';
import Agenda from '@/pages/Agenda';
import Tecnicos from '@/pages/Tecnicos';
import Validacao from '@/pages/Validacao';
import Relatorios from '@/pages/Relatorios';
import Configuracoes from '@/pages/Configuracoes';
import Certificados from '@/pages/Certificados';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import { AuthProvider, useAuth } from '@/contexts/SupabaseAuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import {SettingsProvider} from "@/contexts/SettingsContext";




const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
      <Route 
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/pedidos"
        element={
          <ProtectedRoute>
            <Layout>
              <Pedidos />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/ordem-servico"
        element={
          <ProtectedRoute>
            <Layout>
              <OrdemServico />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/agenda"
        element={
          <ProtectedRoute>
            <Layout>
              <Agenda />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tecnicos"
        element={
          <ProtectedRoute>
            <Layout>
              <Tecnicos />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/validacao"
        element={
          <ProtectedRoute>
            <Layout>
              <Validacao />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/certificados"
        element={
          <ProtectedRoute>
            <Layout>
              <Certificados />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/relatorios"
        element={
          <ProtectedRoute>
            <Layout>
              <Relatorios />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/configuracoes"
        element={
          <ProtectedRoute roles={['administrador']}>
            <Layout>
              <Configuracoes />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
    </Routes>
  );
}

function App() {
  return (
    <>
      <Helmet>
        <title>SIGas - Sistema de Inspeção de Gás</title>
        <meta name="description" content="Sistema completo para gestão de inspeções técnicas de gás residencial e comercial" />
      </Helmet>
      <Router>
        <SettingsProvider>
        <AuthProvider>
          <AppRoutes />
          <Toaster />
        </AuthProvider>
        </SettingsProvider>
      </Router>
    </>
  );
}

export default App;
