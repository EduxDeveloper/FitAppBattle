import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Activity, Eye, EyeOff, User, Mail, Lock, ChevronRight, ChevronLeft,
  Ruler, Weight, Target, Flame, Dumbbell
} from 'lucide-react';
import Swal from 'sweetalert2';
import { API_BASE_URL } from '../../utils/api';

const Register = () => {
  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', username: '', email: '', password: '', confirmPassword: '',
    age: '', gender: '', weightKg: '', heightCm: '', activityLevel: '',
    goal: '', targetWeightKg: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    console.log("Iniciando handleRegister...", formData);
    if (formData.password !== formData.confirmPassword) {
      console.warn("Las contraseñas no coinciden");
      return Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
    }
    try {
      const url = `${API_BASE_URL}/api/register`;
      console.log("Enviando petición POST a:", url);
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      console.log("Respuesta recibida. Estatus:", res.status);
      const data = await res.json();
      console.log("Datos del servidor:", data);
      if (res.ok) {
        console.log("Registro exitoso, redirigiendo...");
        navigate('/verify-code');
      } else {
        console.warn("Registro fallido:", data.message);
        Swal.fire('Error', data.message || 'Error al registrar', 'error');
      }
    } catch (err) {
      console.error("Error de conexión:", err);
      Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
    }
  };

  return (
    <div className="flex justify-center min-h-[100dvh] bg-black">
      <div className="w-full max-w-md min-h-[100dvh] bg-background relative overflow-hidden flex flex-col">

        <div className="absolute top-[-15%] right-[-20%] w-72 h-72 bg-accent-purple/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[5%] left-[-25%] w-80 h-80 bg-accent-red/20 rounded-full blur-[100px] animate-pulse [animation-delay:1.5s]"></div>
        <div className="absolute top-[50%] right-[40%] w-32 h-32 bg-accent-crimson/10 rounded-full blur-[60px] animate-pulse [animation-delay:3s]"></div>

        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-purple to-transparent"></div>

        <div className="relative z-10 flex flex-col flex-1 px-6 pt-12 pb-8 overflow-y-auto">

          <Link to="/login" className="flex items-center gap-1 text-gray-500 hover:text-white transition-colors mb-6 w-fit">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Volver</span>
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent-red to-accent-purple flex items-center justify-center shadow-lg shadow-accent-red/20">
                <Activity className="text-white w-6 h-6" />
              </div>
              <span className="font-bold text-lg text-white">FitBattle AI</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Crea tu cuenta</h2>
            <p className="text-gray-400 text-sm">Únete a la comunidad. Transforma tu cuerpo.</p>
          </div>

          {/* Indicador de pasos */}
          <div className="flex items-center gap-3 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-3 flex-1">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-500 ${step >= s ? 'bg-gradient-to-br from-accent-red to-accent-crimson text-white shadow-lg shadow-accent-red/30' : 'bg-white/[0.06] text-gray-500 border border-white/10'}`}>
                  {s}
                </div>
                <span className={`text-xs font-medium transition-colors ${step >= s ? 'text-white' : 'text-gray-600'}`}>
                  {s === 1 ? 'Cuenta' : 'Cuerpo y Metas'}
                </span>
                {s < 2 && <div className={`flex-1 h-px transition-colors ${step > 1 ? 'bg-accent-red/50' : 'bg-white/10'}`}></div>}
              </div>
            ))}
          </div>

          <form className="flex-1 flex flex-col" onSubmit={(e) => e.preventDefault()}>

            {/* === PASO 1 === */}
            {step === 1 && (
              <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent-red transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <input name="name" value={formData.name} onChange={handleChange} type="text" placeholder="Nombre completo" className="w-full bg-white/[0.06] border border-white/[0.08] rounded-2xl pl-12 pr-4 py-4 text-white text-[15px] placeholder:text-gray-600 focus:outline-none focus:border-accent-red/50 focus:bg-white/[0.08] transition-all duration-300" />
                </div>

                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent-red transition-colors">
                    <span className="text-lg font-bold">@</span>
                  </div>
                  <input name="username" value={formData.username} onChange={handleChange} type="text" placeholder="Nombre de usuario" className="w-full bg-white/[0.06] border border-white/[0.08] rounded-2xl pl-12 pr-4 py-4 text-white text-[15px] placeholder:text-gray-600 focus:outline-none focus:border-accent-red/50 focus:bg-white/[0.08] transition-all duration-300" />
                </div>

                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent-red transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Correo electrónico" className="w-full bg-white/[0.06] border border-white/[0.08] rounded-2xl pl-12 pr-4 py-4 text-white text-[15px] placeholder:text-gray-600 focus:outline-none focus:border-accent-red/50 focus:bg-white/[0.08] transition-all duration-300" />
                </div>

                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent-red transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input name="password" value={formData.password} onChange={handleChange} type={showPass ? 'text' : 'password'} placeholder="Contraseña" className="w-full bg-white/[0.06] border border-white/[0.08] rounded-2xl pl-12 pr-12 py-4 text-white text-[15px] placeholder:text-gray-600 focus:outline-none focus:border-accent-red/50 focus:bg-white/[0.08] transition-all duration-300" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent-red transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type="password" placeholder="Confirmar contraseña" className="w-full bg-white/[0.06] border border-white/[0.08] rounded-2xl pl-12 pr-4 py-4 text-white text-[15px] placeholder:text-gray-600 focus:outline-none focus:border-accent-red/50 focus:bg-white/[0.08] transition-all duration-300" />
                </div>

                <div className="px-1">
                  <div className="flex gap-1.5">
                    <div className="flex-1 h-1 rounded-full bg-accent-red"></div>
                    <div className="flex-1 h-1 rounded-full bg-accent-red"></div>
                    <div className="flex-1 h-1 rounded-full bg-warning"></div>
                    <div className="flex-1 h-1 rounded-full bg-white/10"></div>
                  </div>
                  <p className="text-xs text-warning mt-2">Seguridad media</p>
                </div>
              </div>
            )}

            {/* === PASO 2 === */}
            {step === 2 && (
              <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent-purple transition-colors">
                      <User className="w-4 h-4" />
                    </div>
                    <input name="age" value={formData.age} onChange={handleChange} type="number" placeholder="Edad" className="w-full bg-white/[0.06] border border-white/[0.08] rounded-2xl pl-11 pr-3 py-4 text-white text-[15px] placeholder:text-gray-600 focus:outline-none focus:border-accent-purple/50 focus:bg-white/[0.08] transition-all duration-300" />
                  </div>
                  <div className="relative">
                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-white/[0.06] border border-white/[0.08] rounded-2xl px-4 py-4 text-gray-400 text-[15px] focus:outline-none focus:border-accent-purple/50 appearance-none transition-all duration-300">
                      <option value="">Género</option>
                      <option value="m">Masculino</option>
                      <option value="f">Femenino</option>
                      <option value="o">Otro</option>
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 rotate-90" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent-purple transition-colors">
                      <Weight className="w-4 h-4" />
                    </div>
                    <input name="weightKg" value={formData.weightKg} onChange={handleChange} type="number" placeholder="Peso (kg)" className="w-full bg-white/[0.06] border border-white/[0.08] rounded-2xl pl-11 pr-3 py-4 text-white text-[15px] placeholder:text-gray-600 focus:outline-none focus:border-accent-purple/50 focus:bg-white/[0.08] transition-all duration-300" />
                  </div>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent-purple transition-colors">
                      <Ruler className="w-4 h-4" />
                    </div>
                    <input name="heightCm" value={formData.heightCm} onChange={handleChange} type="number" placeholder="Altura (cm)" className="w-full bg-white/[0.06] border border-white/[0.08] rounded-2xl pl-11 pr-3 py-4 text-white text-[15px] placeholder:text-gray-600 focus:outline-none focus:border-accent-purple/50 focus:bg-white/[0.08] transition-all duration-300" />
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <Dumbbell className="w-5 h-5" />
                  </div>
                  <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="w-full bg-white/[0.06] border border-white/[0.08] rounded-2xl pl-12 pr-4 py-4 text-gray-400 text-[15px] focus:outline-none focus:border-accent-purple/50 appearance-none transition-all duration-300">
                    <option value="">Nivel de actividad</option>
                    <option value="sedentary">Sedentario (trabajo de oficina)</option>
                    <option value="light">Poco activo (1-2x/semana)</option>
                    <option value="moderate">Moderado (3-5x/semana)</option>
                    <option value="very">Muy activo (6-7x/semana)</option>
                    <option value="extreme">Atleta (2x/día)</option>
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 rotate-90" />
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-accent-red" />
                    Tu objetivo principal
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Definir', emoji: '🔥', desc: 'Perder grasa' },
                      { label: 'Volumen', emoji: '💪', desc: 'Ganar músculo' },
                      { label: 'Mantener', emoji: '⚖️', desc: 'Estar lean' },
                    ].map((goal, i) => (
                      <button
                        key={goal.label}
                        type="button"
                        onClick={() => setFormData({...formData, goal: goal.label})}
                        className={`flex flex-col items-center gap-1.5 p-4 rounded-2xl border transition-all duration-300 ${formData.goal === goal.label ? 'bg-accent-red/10 border-accent-red/30 shadow-lg shadow-accent-red/10' : 'bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.06]'}`}
                      >
                        <span className="text-2xl">{goal.emoji}</span>
                        <span className={`text-xs font-bold ${formData.goal === goal.label ? 'text-accent-red' : 'text-gray-300'}`}>{goal.label}</span>
                        <span className="text-[10px] text-gray-500">{goal.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent-purple transition-colors">
                    <Flame className="w-5 h-5" />
                  </div>
                  <input name="targetWeightKg" value={formData.targetWeightKg} onChange={handleChange} type="number" placeholder="Peso objetivo (kg)" className="w-full bg-white/[0.06] border border-white/[0.08] rounded-2xl pl-12 pr-4 py-4 text-white text-[15px] placeholder:text-gray-600 focus:outline-none focus:border-accent-purple/50 focus:bg-white/[0.08] transition-all duration-300" />
                </div>

                <div className="glass rounded-2xl p-4 border border-accent-red/20 bg-gradient-to-r from-accent-red/10 to-accent-purple/10">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-accent-red/20 rounded-xl shrink-0 mt-0.5">
                      <Activity className="w-4 h-4 text-accent-red" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white mb-0.5">Configuración con IA</p>
                      <p className="text-xs text-gray-400 leading-relaxed">Tu IMC, TMB, TDEE y macros diarios se calcularán automáticamente con tus datos.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Botones de navegación */}
            <div className="mt-auto pt-6 space-y-3">
              {step === 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="group relative block w-full text-center py-4 rounded-2xl font-bold text-white overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-red via-accent-crimson to-accent-red bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite]"></div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10"></div>
                  <div className="relative flex items-center justify-center gap-2">
                    <span className="text-[15px]">Continuar</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleRegister}
                    className="group relative block w-full text-center py-4 rounded-2xl font-bold text-white overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-accent-purple via-purple-700 to-accent-purple bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite]"></div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10"></div>
                    <div className="relative flex items-center justify-center gap-2">
                      <span className="text-[15px]">Crear Cuenta</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full py-3 text-sm text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Volver a datos de cuenta
                  </button>
                </>
              )}
            </div>
          </form>

          <div className="pt-6 text-center">
            <p className="text-sm text-gray-500">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-accent-red font-semibold hover:text-white transition-colors">
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
