import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Target, ScanLine, Calendar, User } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Inicio' },
  { path: '/challenges', icon: Target, label: 'Competir' },
  { path: '/food-scanner', icon: ScanLine, label: 'Escanear', isCenter: true },
  { path: '/calendar', icon: Calendar, label: 'Calendario' },
  { path: '/profile', icon: User, label: 'Perfil' },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <div className="absolute bottom-0 left-0 right-0 glass border-t border-white/10 z-50 px-4 pt-3 pb-[max(env(safe-area-inset-bottom),16px)] bg-background/80">
      <nav className="w-full flex items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.includes(item.path);
          
          if (item.isCenter) {
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="relative -top-6 group"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-accent-red to-accent-purple p-0.5 shadow-lg shadow-accent-red/30 transform transition-transform group-hover:scale-105 active:scale-95">
                  <div className="w-full h-full bg-background rounded-full flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => clsx(
                "flex flex-col items-center justify-center gap-1 w-12 h-full transition-colors",
                isActive ? "text-accent-red" : "text-gray-500 hover:text-gray-300"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;
