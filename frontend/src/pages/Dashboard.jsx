import { Link } from 'react-router-dom';
import { Activity, Flame, Target, Trophy, ChevronRight, BarChart2, CalendarDays } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import StatCard from '../components/ui/StatCard';
import CircularProgress from '../components/ui/CircularProgress';
import ProgressBar from '../components/ui/ProgressBar';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [mealLogs, setMealLogs] = useState([]);
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0 });
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchLogs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/meal-logs?userId=${user._id}`);
        if (response.ok) {
          const data = await response.json();
          // Filter only today's logs
          const today = new Date().toDateString();
          const todayLogs = data.filter(log => new Date(log.date).toDateString() === today);
          setMealLogs(todayLogs);
          
          let tCal = 0, tPro = 0, tCar = 0, tFat = 0;
          todayLogs.forEach(log => {
            tCal += log.calories || 0;
            tPro += log.proteinG || 0;
            tCar += log.carbsG || 0;
            tFat += log.fatsG || 0;
          });
          setTotals({ calories: Math.round(tCal), protein: Math.round(tPro), carbs: Math.round(tCar), fats: Math.round(tFat) });
        }

        // Fetch challenge participants
        const resParticipants = await fetch(`${API_BASE_URL}/api/challenge-participants`);
        if (resParticipants.ok) {
          const allParticipants = await resParticipants.json();
          // Find if user is in any challenge
          const myParticipant = allParticipants.find(p => p.userId === user._id || (p.userId && p.userId._id === user._id));
          if (myParticipant && myParticipant.challengeId) {
            // Get all participants of that same challenge to show ranking
            const cId = typeof myParticipant.challengeId === 'object' ? myParticipant.challengeId._id : myParticipant.challengeId;
            const myChallengeParticipants = allParticipants.filter(p => {
              const pcId = typeof p.challengeId === 'object' ? p.challengeId._id : p.challengeId;
              return pcId === cId;
            });
            // Sort by rank or progress
            myChallengeParticipants.sort((a, b) => (b.currentValue || 0) - (a.currentValue || 0));
            setParticipants(myChallengeParticipants);
          }
        }
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLogs();
  }, [user]);

  if (!user) return null;
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Bienvenido, {user.name ? user.name.split(' ')[0] : 'Usuario'}</h1>
          <p className="text-gray-400">La constancia es la clave del progreso. ¡A por ello!</p>
        </div>
        <Link to="/food-scanner" className="px-6 py-2.5 bg-gradient-to-r from-accent-red to-accent-crimson rounded-xl font-semibold text-white shadow-lg shadow-accent-red/20 hover:opacity-90 transition-opacity">
          Registrar comida
        </Link>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/profile"><StatCard title="Peso actual" value={`${user.weightKg || '--'} kg`} icon={Target} trend="down" trendValue="-- kg" color="accent-red" /></Link>
        <Link to="/statistics"><StatCard title="Racha activa" value={`${user.currentStreak || 0} Días`} icon={Flame} color="warning" /></Link>
        <Link to="/daily-view"><StatCard title="Comidas registradas" value={`${mealLogs.length} hoy`} icon={Activity} trend="up" trendValue={mealLogs.length.toString()} color="accent-purple" /></Link>
        <Link to="/challenges"><StatCard title="Rango en Reto" value={participants.length > 0 ? `#${participants.findIndex(p => (p.userId && p.userId._id) === user._id || p.userId === user._id) + 1}` : '--'} icon={Trophy} color="warning" /></Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Daily Summary */}
        <div className="space-y-6">
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Resumen diario</h2>
              <Link to="/daily-view" className="text-sm text-accent-red hover:text-white transition-colors">Detalles</Link>
            </div>
            
            <div className="flex flex-col items-center gap-8">
              <div className="flex-shrink-0 relative">
                <CircularProgress 
                  value={totals.calories} 
                  max={user.dailyCaloriesTarget || 2400} 
                  size={160} 
                  strokeWidth={12} 
                  label={totals.calories.toString()} 
                  subLabel="kcal ingeridas" 
                />
              </div>
              
              <div className="flex-1 w-full space-y-5">
                <ProgressBar 
                  progress={Math.min(100, (totals.protein / (user.macros?.proteinG || 150)) * 100) || 0} 
                  label="Proteínas" 
                  value={`${totals.protein}g / ${user.macros?.proteinG || 150}g`} 
                  colorClass="bg-accent-purple" 
                />
                <ProgressBar 
                  progress={Math.min(100, (totals.carbs / (user.macros?.carbsG || 250)) * 100) || 0} 
                  label="Carbohidratos" 
                  value={`${totals.carbs}g / ${user.macros?.carbsG || 250}g`} 
                  colorClass="bg-accent-red" 
                />
                <ProgressBar 
                  progress={Math.min(100, (totals.fats / (user.macros?.fatsG || 70)) * 100) || 0} 
                  label="Grasas" 
                  value={`${totals.fats}g / ${user.macros?.fatsG || 70}g`} 
                  colorClass="bg-warning" 
                />
              </div>
            </div>
          </GlassCard>

          {/* Today's Meals */}
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Comidas de hoy</h2>
              <Link to="/daily-view" className="text-sm text-accent-red hover:text-white transition-colors">Ver todas</Link>
            </div>
            <div className="space-y-4">
              {loading ? (
                <p className="text-gray-500 text-center text-sm py-4">Cargando comidas...</p>
              ) : mealLogs.length === 0 ? (
                <p className="text-gray-500 text-center text-sm py-4">No has registrado comidas hoy</p>
              ) : (
                mealLogs.map((log) => (
                  <Link to="/daily-view" key={log._id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent-red/10 flex items-center justify-center text-accent-red font-bold">
                        {log.mealType ? log.mealType[0] : 'C'}
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{log.mealType || 'Comida'}</h4>
                        <p className="text-sm text-gray-400">{log.foodItemId?.name || 'Comida'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-white">{log.calories} kcal</span>
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </GlassCard>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/statistics" className="glass rounded-2xl p-4 flex items-center gap-3 hover:bg-white/10 transition-colors">
            <div className="p-2 bg-accent-purple/10 rounded-xl"><BarChart2 className="w-5 h-5 text-accent-purple" /></div>
            <span className="text-sm font-medium text-white">Estadísticas</span>
          </Link>
          <Link to="/daily-view" className="glass rounded-2xl p-4 flex items-center gap-3 hover:bg-white/10 transition-colors">
            <div className="p-2 bg-accent-red/10 rounded-xl"><CalendarDays className="w-5 h-5 text-accent-red" /></div>
            <span className="text-sm font-medium text-white">Vista diaria</span>
          </Link>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">


          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Clasificación del reto activo</h2>
              <Link to="/challenges" className="text-sm text-accent-red hover:text-white transition-colors">Ver todos</Link>
            </div>
            <div className="space-y-4">
              {participants.length === 0 ? (
                <p className="text-gray-500 text-sm py-2">No estás en un reto todavía. Únete o crea uno para ver la clasificación.</p>
              ) : (
                participants.map((p, i) => {
                  const isMe = (p.userId && p.userId._id) === user._id || p.userId === user._id;
                  const name = isMe ? 'Tú' : (p.userId?.name || 'Usuario');
                  let color = 'text-gray-300';
                  if (i === 0) color = 'text-warning';
                  else if (i === 1) color = 'text-gray-300';
                  else if (i === 2) color = 'text-orange-400';
                  
                  return (
                    <div key={p._id || i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`font-bold w-4 ${color}`}>{i + 1}</span>
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white">
                          {name[0]}
                        </div>
                        <span className={isMe ? 'text-white font-semibold' : 'text-gray-300'}>
                          {name}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-400">{p.currentValue || 0} pts</span>
                    </div>
                  );
                })
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
