import { SettingsIcon, Activity } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

const Topbar = () => {
  const location = useLocation();
  
  // Format pathname for header title
  const getPageTitle = () => {
    const path = location.pathname.split('/')[1] || 'dashboard';
    const titles = {
      'dashboard': 'Inicio',
      'profile': 'Perfil',
      'challenges': 'Retos',
      'food-scanner': 'Escáner',
      'calendar': 'Calendario',
      'statistics': 'Estadísticas',
      'daily-view': 'Vista Diaria',
      'group-chat': 'Chat de Grupo',
      'settings': 'Ajustes',
      'privacy': 'Privacidad'
    };
    return titles[path] || (path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' '));
  };

  return (
    <header className="h-16 glass border-b border-white/10 flex items-center justify-between px-4 z-30 sticky top-0 shrink-0">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-red to-accent-purple flex items-center justify-center shadow-lg shadow-accent-red/20">
          <Activity className="text-white w-5 h-5" />
        </div>
        <span className="font-bold text-lg bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          {getPageTitle()}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <NavLink 
          to="/settings" 
          className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <SettingsIcon className="w-5 h-5" />
        </NavLink>
      </div>
    </header>
  );
};

export default Topbar;
