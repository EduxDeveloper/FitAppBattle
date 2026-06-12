import { Link } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';
import { Plus, ScanLine, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../utils/api';

const DailyView = () => {
  const { user } = useAuth();
  const [mealLogs, setMealLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchLogs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/meal-logs?userId=${user._id}`);
        if (response.ok) {
          const data = await response.json();
          const today = new Date().toDateString();
          const todayLogs = data.filter(log => new Date(log.date).toDateString() === today);
          setMealLogs(todayLogs);
        }
      } catch (error) {
        console.error("Error fetching daily meals", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [user]);

  const getMealGroup = (name) => {
    const logs = mealLogs.filter(m => (m.mealType || 'Comida').toLowerCase() === name.toLowerCase());
    const total = logs.reduce((sum, m) => sum + (m.calories || 0), 0);
    const items = logs.map(m => `${m.foodItemId?.name || 'Comida'} (${m.calories || 0} kcal)`);
    return { name, total, items };
  };

  const meals = [
    getMealGroup('Desayuno'),
    getMealGroup('Comida'),
    getMealGroup('Cena'),
    getMealGroup('Snack')
  ];

  const totalCalories = meals.reduce((sum, m) => sum + m.total, 0);

  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const todayString = new Date().toLocaleDateString('es-ES', dateOptions);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Registro de Hoy</h1>
          <p className="text-sm text-gray-400 capitalize">{todayString}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{totalCalories} <span className="text-sm text-gray-500">/ {user.dailyCaloriesTarget || 2400}</span></div>
        </div>
      </div>

      {/* Quick scan CTA */}
      <Link to="/food-scanner" className="flex items-center gap-3 glass rounded-2xl p-4 border border-accent-red/20 bg-gradient-to-r from-accent-red/10 to-transparent hover:bg-accent-red/15 transition-colors">
        <div className="p-2 bg-accent-red/20 rounded-xl">
          <ScanLine className="w-5 h-5 text-accent-red" />
        </div>
        <div className="flex-1">
          <span className="text-sm font-semibold text-white">Escanear comida con IA</span>
          <p className="text-xs text-gray-400">Toma una foto para detectar calorías</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-500" />
      </Link>

      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-gray-500 py-10">Cargando comidas...</p>
        ) : (
          meals.map((meal) => (
            <GlassCard key={meal.name} className="flex flex-col gap-3">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h2 className="text-lg font-bold text-white">{meal.name}</h2>
                <span className="font-semibold text-gray-300 text-sm">{meal.total} kcal</span>
              </div>
              
              <div className="space-y-2">
                {meal.items.length > 0 ? (
                  meal.items.map((item, idx) => {
                    const parts = item.split(' (');
                    return (
                      <div key={idx} className="text-gray-400 text-sm flex justify-between">
                        <span>{parts[0]}</span>
                        <span>{parts[1] ? parts[1].replace(')', '') : ''}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-gray-500 italic text-sm">Nada registrado aún.</div>
                )}
              </div>

              <Link to="/food-scanner" className="flex items-center justify-center gap-2 w-full py-2.5 mt-1 bg-white/5 hover:bg-white/10 rounded-xl text-accent-red font-semibold text-sm transition-colors">
                <Plus className="w-4 h-4" /> Agregar Comida
              </Link>
            </GlassCard>
          ))
        )}
      </div>
      
      <GlassCard>
        <h3 className="text-lg font-bold text-white mb-2">Notas diarias</h3>
        <textarea 
          placeholder="¿Cómo te sientes hoy? ¿Algún antojo?" 
          className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-accent-red"
          rows={3}
        ></textarea>
      </GlassCard>

      {/* Bottom links */}
      <div className="grid grid-cols-2 gap-3">
        <Link to="/calendar" className="glass rounded-2xl p-3 text-center text-sm font-medium text-gray-300 hover:bg-white/10 transition-colors">
          📅 Calendario
        </Link>
        <Link to="/statistics" className="glass rounded-2xl p-3 text-center text-sm font-medium text-gray-300 hover:bg-white/10 transition-colors">
          📊 Estadísticas
        </Link>
      </div>
    </div>
  );
};

export default DailyView;
