import { Link } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';
import { Bell, Trophy, Flame, MessageSquare, ScanLine, ChevronRight } from 'lucide-react';

const Notifications = () => {
  const notifs = [
    { icon: Trophy, color: 'text-warning', title: 'Actualización de Reto', time: 'hace 2 horas', desc: '¡Marcus te ha superado en el reto Definición de Verano!', link: '/challenges' },
    { icon: Bell, color: 'text-accent-purple', title: 'Recordatorio de Comida', time: 'hace 5 horas', desc: 'No olvides registrar tu comida para mantener tu racha.', link: '/food-scanner' },
    { icon: Flame, color: 'text-accent-red', title: 'Racha Mantenida', time: 'Ayer', desc: '¡Genial! Has alcanzado tu meta de calorías 5 días seguidos.', link: '/statistics' },
    { icon: MessageSquare, color: 'text-success', title: 'Nuevo Mensaje', time: 'Ayer', desc: 'Sarah J. envió un mensaje en el grupo Definición de Verano.', link: '/group-chat' },
    { icon: ScanLine, color: 'text-warning', title: 'Recordatorio de Peso', time: 'hace 2 días', desc: '¡Es hora de tu pesaje semanal! Actualiza tu progreso.', link: '/profile' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-white">Notificaciones</h1>
        <button className="text-xs text-accent-red hover:text-white transition-colors">Marcar todo como leído</button>
      </div>

      <div className="space-y-3">
        {notifs.map((n, i) => {
          const Icon = n.icon;
          return (
            <Link to={n.link} key={i}>
              <GlassCard className="flex items-start gap-3 p-4 hover:bg-white/10 transition-colors cursor-pointer">
                <div className={`p-2.5 rounded-xl bg-white/5 ${n.color} shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <h3 className="font-bold text-white text-sm">{n.title}</h3>
                    <span className="text-[10px] text-gray-500 shrink-0 ml-2">{n.time}</span>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">{n.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 shrink-0 mt-1" />
              </GlassCard>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Notifications;
