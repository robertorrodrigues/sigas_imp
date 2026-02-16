
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  FileText, 
  ClipboardList, 
  Calendar, 
  Users, 
  CheckCircle, 
  BarChart3, 
  Settings,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Award,
  Flame
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const allNavigation = [
  { name: 'Dashboard', href: '/', icon: Home, roles: ['administrador', 'tecnico', 'atendente'] },
  { name: 'Pedidos', href: '/pedidos', icon: FileText, roles: ['administrador', 'atendente'] },
  { name: 'Ordem de Serviço', href: '/ordem-servico', icon: ClipboardList, roles: ['administrador', 'tecnico'] },
  { name: 'Agenda', href: '/agenda', icon: Calendar, roles: ['administrador', 'atendente'] },
  { name: 'Técnicos', href: '/tecnicos', icon: Users, roles: ['administrador'] },
  { name: 'Validação', href: '/validacao', icon: CheckCircle, roles: ['administrador'] },
  { name: 'Certificados', href: '/certificados', icon: Award, roles: ['administrador', 'atendente'] },
  { name: 'Relatórios', href: '/relatorios', icon: BarChart3, roles: ['administrador'] },
  { name: 'Configurações', href: '/configuracoes', icon: Settings, roles: ['administrador'] },
];

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const userRole = user?.user_metadata?.role || 'atendente';
  const userName = user?.user_metadata?.name || user?.email || 'Usuário';

  const navigation = allNavigation.filter(item => item.roles.includes(userRole));

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex flex-col">
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white/5 backdrop-blur-sm border-b border-white/10 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <Flame className="w-7 h-7 text-orange-400" />
            <h1 className="text-xl font-bold text-white hidden sm:block">SIGas</h1>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <div className="relative">
            <div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {userName?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="hidden sm:block text-white">
                <span className="font-medium">{userName}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
            </div>
            <AnimatePresence>
              {profileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-xl rounded-lg shadow-lg border border-white/20"
                >
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-3 py-2 text-sm text-red-400 hover:bg-white/10 rounded-md"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Button
            onClick={() => setSidebarOpen(true)}
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-white/10"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </header>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-slate-900/90 backdrop-blur-xl border-r border-white/20 lg:hidden"
            >
              <div className="flex items-center justify-between h-16 px-6 border-b border-white/20 shrink-0">
                <div className="flex items-center gap-2">
                  <Flame className="w-7 h-7 text-orange-400" />
                  <h1 className="text-xl font-bold text-white">SIGas</h1>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden text-white hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="mt-8 px-4">
                <div className="space-y-2">
                  {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                            : 'text-gray-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
