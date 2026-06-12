import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';
import { ChevronLeft, ChevronRight, CheckCircle2, CalendarDays } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../utils/api';

const Calendar = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mealLogs, setMealLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/meal-logs?userId=${user._id}`);
        if (res.ok) {
          const data = await res.json();
          setMealLogs(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [user]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Agrupar mealLogs por día para el mes actual
  const logsByDay = {};
  mealLogs.forEach(log => {
    const d = new Date(log.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!logsByDay[day]) logsByDay[day] = { calories: 0, items: 0 };
      logsByDay[day].calories += (log.calories || 0);
      logsByDay[day].items += 1;
    }
  });

  const calendarDays = [];
  // Previous month trailing days
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push({ day: daysInPrevMonth - firstDayOfMonth + i + 1, isCurrentMonth: false, isCompleted: false, isToday: false });
  }
  // Current month days
  const today = new Date();
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = today.getDate() === i && today.getMonth() === month && today.getFullYear() === year;
    const log = logsByDay[i];
    // Consider completed if logged calories > 0
    const isCompleted = log && log.calories > 0;
    calendarDays.push({ day: i, isCurrentMonth: true, isCompleted, isToday });
  }
  // Next month leading days
  const remainingCells = 42 - calendarDays.length; // 6 rows of 7
  for (let i = 1; i <= remainingCells; i++) {
    calendarDays.push({ day: i, isCurrentMonth: false, isCompleted: false, isToday: false });
  }

  // Resumen Mensual calculations
  let sumCal = 0;
  let perfectDays = 0;
  let activeDays = Object.keys(logsByDay).length;

  Object.values(logsByDay).forEach(log => {
    sumCal += log.calories;
    if (user && user.dailyCaloriesTarget) {
      if (log.calories >= user.dailyCaloriesTarget * 0.8 && log.calories <= user.dailyCaloriesTarget * 1.2) {
        perfectDays++;
      }
    } else {
      if (log.calories > 0) perfectDays++;
    }
  });

  const avgCal = activeDays > 0 ? Math.round(sumCal / activeDays) : 0;

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white capitalize">{monthNames[month]} {year}</h1>
        <div className="flex gap-2">
          <button onClick={handlePrevMonth} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button onClick={handleNextMonth} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <GlassCard>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {days.map(day => (
              <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((d, i) => (
              <div
                key={i} 
                className={`aspect-square rounded-xl flex flex-col items-center justify-center relative border transition-all cursor-default
                  ${d.isCurrentMonth ? 'bg-white/5 border-transparent' : 'bg-transparent border-transparent opacity-30 pointer-events-none'}
                  ${d.isToday ? 'border-accent-red ring-1 ring-accent-red/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : ''}
                `}
              >
                <span className={`text-sm font-medium ${d.isCurrentMonth ? 'text-white' : 'text-gray-500'}`}>
                  {d.day}
                </span>
                {d.isCurrentMonth && d.isCompleted && (
                  <CheckCircle2 className="w-3 h-3 text-success absolute bottom-1" />
                )}
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard>
            <h3 className="text-lg font-bold text-white mb-4">Resumen Mensual</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Días perfectos</span>
                <span className="text-white font-bold">{perfectDays} días</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Calorías promedio</span>
                <span className="text-white font-bold">{avgCal} kcal</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Días Activos</span>
                <span className="text-white font-bold">{activeDays}</span>
              </div>
            </div>
          </GlassCard>

          {/* Quick links */}
          <div className="grid grid-cols-2 gap-3">
            <Link to="/daily-view" className="glass rounded-2xl p-4 flex items-center gap-3 hover:bg-white/10 transition-colors">
              <CalendarDays className="w-5 h-5 text-accent-red" />
              <span className="text-sm font-medium text-white">Hoy</span>
            </Link>
            <Link to="/statistics" className="glass rounded-2xl p-4 flex items-center gap-3 hover:bg-white/10 transition-colors">
              <ChevronRight className="w-5 h-5 text-accent-purple" />
              <span className="text-sm font-medium text-white">Estadísticas</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
