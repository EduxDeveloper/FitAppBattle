import { Link } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';
import StatCard from '../components/ui/StatCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Target, Flame, TrendingDown, Award, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../utils/api';

const Statistics = () => {
  const { user } = useAuth();
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState({ avgCalories: 0, weightLost: 0, complGoal: 0 });

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        const [mealsRes, weightsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/meal-logs?userId=${user._id}`),
          fetch(`${API_BASE_URL}/api/weight-logs?userId=${user._id}`)
        ]);

        const meals = mealsRes.ok ? await mealsRes.json() : [];
        const weights = weightsRes.ok ? await weightsRes.json() : [];

        // Generar los últimos 7 días
        const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const last7Days = [];
        let totalCals = 0;
        let daysWithMeals = 0;

        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateString = d.toDateString();
          
          // Calorías del día
          const dayMeals = meals.filter(m => new Date(m.date).toDateString() === dateString);
          const cals = dayMeals.reduce((sum, m) => sum + (m.calories || 0), 0);
          
          if (cals > 0) {
            totalCals += cals;
            daysWithMeals++;
          }

          // Peso del día (o el último disponible)
          const dayWeight = weights.find(w => new Date(w.date).toDateString() === dateString);
          let wVal = dayWeight ? dayWeight.weightKg : null;
          
          last7Days.push({
            name: days[d.getDay()],
            fullDate: d,
            calories: cals,
            weight: wVal
          });
        }

        // Llenar pesos vacíos con el anterior conocido
        let lastKnownWeight = user.weightKg || 0;
        for (let i = 0; i < last7Days.length; i++) {
          if (last7Days[i].weight !== null) {
            lastKnownWeight = last7Days[i].weight;
          } else {
            last7Days[i].weight = lastKnownWeight;
          }
        }

        setChartData(last7Days);

        const avgCal = daysWithMeals > 0 ? Math.round(totalCals / daysWithMeals) : 0;
        const currentWeight = last7Days[6].weight || user.weightKg;
        // Asumiendo que startWeight está en user, si no, calculamos desde el primer peso registrado
        const firstWeight = weights.length > 0 ? weights[weights.length - 1].weightKg : user.weightKg;
        const lost = firstWeight - currentWeight;
        
        let compl = 0;
        if (user.dailyCaloriesTarget && avgCal > 0) {
           compl = Math.round((avgCal / user.dailyCaloriesTarget) * 100);
           if (compl > 100) compl = 100; // si se pasó, cap a 100 o reflejar exceso
        }

        setStats({ avgCalories: avgCal, weightLost: lost.toFixed(1), complGoal: compl });

      } catch (err) {
        console.error("Error loading stats", err);
      }
    };
    loadData();
  }, [user]);

  if (!user) return null;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white mb-4">Rendimiento</h1>

      <div className="grid grid-cols-2 gap-3">
        <StatCard title="Mejor Racha" value={`${user.highestStreak || user.currentStreak || 0} Días`} icon={Flame} color="warning" />
        <StatCard title="Promedio Calorías" value={stats.avgCalories} icon={Target} color="accent-purple" />
        <StatCard title="Total Perdido" value={`${stats.weightLost} kg`} icon={TrendingDown} color="success" />
        <StatCard title="Meta Comp." value={`${stats.complGoal}%`} icon={Award} color="accent-red" />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <GlassCard>
          <h2 className="text-lg font-bold text-white mb-4">Ingesta Calórica</h2>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="#A1A1AA" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis stroke="#A1A1AA" tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: '#111111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="calories" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="text-lg font-bold text-white mb-4">Progresión de Peso</h2>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="#A1A1AA" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#A1A1AA" tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="weight" stroke="#7C3AED" strokeWidth={3} dot={{ fill: '#7C3AED', strokeWidth: 2, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Navigation links */}
      <div className="space-y-3">
        <Link to="/daily-view" className="glass rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors">
          <span className="text-sm font-medium text-gray-300">Ver registro de hoy</span>
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </Link>
        <Link to="/calendar" className="glass rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors">
          <span className="text-sm font-medium text-gray-300">Abrir calendario</span>
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </Link>
      </div>
    </div>
  );
};

export default Statistics;
