import { Link } from 'react-router-dom';
import { Edit2, Activity, Target, Flame, BarChart2, Settings, ChevronRight } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import StatCard from '../components/ui/StatCard';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { useRef } from 'react';
import { API_BASE_URL } from '../utils/api';

const Profile = () => {
  const { user, checkLogin } = useAuth();
  const fileInputRef = useRef(null);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Avatar = reader.result;
      Swal.fire({ title: 'Subiendo imagen...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/${user._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ avatar: base64Avatar })
        });
        if (response.ok) {
          await checkLogin();
          Swal.fire({ icon: 'success', title: 'Foto actualizada', background: '#111', color: '#fff', timer: 1500, showConfirmButton: false });
        } else {
          Swal.fire('Error', 'No se pudo subir la foto', 'error');
        }
      } catch (err) {
        Swal.fire('Error', 'Error de conexión', 'error');
      }
    };
  };

  const handleEditProfile = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Editar Perfil',
      html:
        `<input id="swal-name" class="swal2-input" placeholder="Nombre" type="text" value="${user.name || ''}">` +
        `<input id="swal-username" class="swal2-input" placeholder="Usuario" type="text" value="${user.username || ''}">` +
        `<input id="swal-age" class="swal2-input" placeholder="Edad" type="number" value="${user.age || ''}">` +
        `<input id="swal-height" class="swal2-input" placeholder="Altura (cm)" type="number" value="${user.heightCm || ''}">` +
        `<input id="swal-weight" class="swal2-input" placeholder="Peso (kg)" type="number" value="${user.weightKg || ''}">` +
        `<select id="swal-gender" class="swal2-input">
           <option value="m" ${user.gender === 'm' ? 'selected' : ''}>Hombre</option>
           <option value="f" ${user.gender === 'f' ? 'selected' : ''}>Mujer</option>
         </select>` +
        `<select id="swal-goal" class="swal2-input">
           <option value="Definir" ${user.goal === 'Definir' ? 'selected' : ''}>Definir (Perder Grasa)</option>
           <option value="Mantener" ${user.goal === 'Mantener' ? 'selected' : ''}>Mantener</option>
           <option value="Volumen" ${user.goal === 'Volumen' ? 'selected' : ''}>Volumen (Ganar Músculo)</option>
         </select>` +
        `<select id="swal-activity" class="swal2-input">
           <option value="sedentary" ${user.activityLevel === 'sedentary' ? 'selected' : ''}>Sedentario</option>
           <option value="light" ${user.activityLevel === 'light' ? 'selected' : ''}>Ligero (1-3 días)</option>
           <option value="moderate" ${user.activityLevel === 'moderate' ? 'selected' : ''}>Moderado (3-5 días)</option>
           <option value="very" ${user.activityLevel === 'very' ? 'selected' : ''}>Muy Activo (6-7 días)</option>
           <option value="extreme" ${user.activityLevel === 'extreme' ? 'selected' : ''}>Extremo</option>
         </select>`,
      focusConfirm: false,
      background: '#111',
      color: '#fff',
      confirmButtonColor: '#ff2a5f',
      preConfirm: () => {
        return {
          name: document.getElementById('swal-name').value,
          username: document.getElementById('swal-username').value,
          age: parseInt(document.getElementById('swal-age').value),
          heightCm: parseFloat(document.getElementById('swal-height').value),
          weightKg: parseFloat(document.getElementById('swal-weight').value),
          gender: document.getElementById('swal-gender').value,
          goal: document.getElementById('swal-goal').value,
          activityLevel: document.getElementById('swal-activity').value
        }
      }
    });

    if (formValues) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/${user._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formValues)
        });
        if (response.ok) {
          Swal.fire({ icon: 'success', title: 'Perfil actualizado', background: '#111', color: '#fff', showConfirmButton: false, timer: 1500 });
          checkLogin(); // Refresh user data
        }
      } catch (err) {
        Swal.fire('Error', 'No se pudo actualizar', 'error');
      }
    }
  };

  if (!user) return null;
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        {/* User Info */}
        <GlassCard className="flex flex-col items-center text-center">
          <div className="relative group mb-4">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white/10 relative bg-white/5">
              <img 
                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=1a1a1a&color=ff2a5f&size=400&font-size=0.33`} 
                alt="User" 
                className="w-full h-full object-cover" 
              />
            </div>
            <button 
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-0 right-0 p-2 bg-accent-red rounded-full text-white shadow-lg shadow-accent-red/20 hover:bg-accent-crimson transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleAvatarChange} 
            />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">{user.name || 'Usuario Nuevo'}</h2>
          <p className="text-gray-400 text-sm mb-6">@{user.username || 'usuario'} • Registrado</p>
          
          <div className="flex justify-center gap-6 w-full border-t border-white/10 pt-6">
            <div>
              <div className="text-2xl font-bold text-white">{user.age || '--'}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Edad</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{user.heightCm || '--'}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Altura</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{user.weightKg || '--'}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Peso</div>
            </div>
          </div>
          
          <button onClick={handleEditProfile} className="w-full mt-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl font-semibold text-white transition-colors block text-center">
            Editar Perfil
          </button>
        </GlassCard>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass rounded-2xl p-4 text-center">
            <div className="text-xl font-bold text-success">{user.bmi || '--'}</div>
            <div className="text-[10px] text-gray-500 uppercase mt-1">IMC</div>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <div className="text-xl font-bold text-warning">{user.bmr || '--'}</div>
            <div className="text-[10px] text-gray-500 uppercase mt-1">TMB</div>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <div className="text-xl font-bold text-accent-purple">{user.tdee || '--'}</div>
            <div className="text-[10px] text-gray-500 uppercase mt-1">TDEE</div>
          </div>
        </div>

        {/* Goal */}
        <GlassCard>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Meta: {user.goal || 'Sin Definir'}</h3>
            <span className="px-3 py-1 bg-accent-red/20 text-accent-red rounded-full text-xs font-semibold">
              Calorías: {user.dailyCaloriesTarget || '--'}
            </span>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Calorías diarias</span>
                <span className="text-white font-bold">{user.dailyCaloriesTarget || '--'} kcal</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-accent-red w-full"></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/5 p-3 rounded-xl text-center">
                <div className="text-accent-purple font-bold text-lg mb-0.5">{user.macros?.proteinG || '--'}g</div>
                <div className="text-[10px] text-gray-400 uppercase">Proteínas</div>
              </div>
              <div className="bg-white/5 p-3 rounded-xl text-center">
                <div className="text-accent-red font-bold text-lg mb-0.5">{user.macros?.carbsG || '--'}g</div>
                <div className="text-[10px] text-gray-400 uppercase">Carbos</div>
              </div>
              <div className="bg-white/5 p-3 rounded-xl text-center">
                <div className="text-warning font-bold text-lg mb-0.5">{user.macros?.fatsG || '--'}g</div>
                <div className="text-[10px] text-gray-400 uppercase">Grasas</div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Quick Navigation */}
        <div className="space-y-3">
          <Link to="/statistics" className="glass rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-purple/10 rounded-xl"><BarChart2 className="w-5 h-5 text-accent-purple" /></div>
              <span className="text-sm font-medium text-white">Ver Estadísticas</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </Link>
          <Link to="/daily-view" className="glass rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-red/10 rounded-xl"><Activity className="w-5 h-5 text-accent-red" /></div>
              <span className="text-sm font-medium text-white">Registro de Hoy</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </Link>
          <Link to="/settings" className="glass rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-xl"><Settings className="w-5 h-5 text-gray-400" /></div>
              <span className="text-sm font-medium text-white">Ajustes</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
