import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Eye, EyeOff, Mail, Lock, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import { API_BASE_URL } from '../../utils/api';

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user);
        
        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          text: 'Has iniciado sesión correctamente.',
          background: '#111',
          color: '#fff',
          confirmButtonColor: '#ff2a5f',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          navigate('/dashboard');
        });

      } else {
        const errorMsg = data.message || 'Error al iniciar sesión';
        setError(errorMsg);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: errorMsg,
          background: '#111',
          color: '#fff',
          confirmButtonColor: '#ff2a5f'
        });
      }
    } catch (err) {
      setError('Error de conexión');
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo contactar al servidor.',
        background: '#111',
        color: '#fff',
        confirmButtonColor: '#ff2a5f'
      });
    }
  };

  return (
    <div className="flex justify-center min-h-[100dvh] bg-black">
      <div className="w-full max-w-md min-h-[100dvh] bg-background relative overflow-hidden flex flex-col">

        {/* Orbes animados de fondo */}
        <div className="absolute top-[-20%] left-[-30%] w-80 h-80 bg-accent-red/25 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-20%] w-72 h-72 bg-accent-purple/20 rounded-full blur-[100px] animate-pulse [animation-delay:1s]"></div>
        <div className="absolute top-[40%] left-[60%] w-40 h-40 bg-accent-crimson/15 rounded-full blur-[80px] animate-pulse [animation-delay:2s]"></div>

        {/* Línea decorativa superior */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-red to-transparent"></div>

        {/* Contenido */}
        <div className="relative z-10 flex flex-col flex-1 px-6 pt-16 pb-8">

          {/* Logo y marca */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-accent-red/30 rounded-2xl blur-xl scale-150"></div>
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-red via-accent-crimson to-accent-purple flex items-center justify-center shadow-2xl shadow-accent-red/30 border border-white/10">
                <Activity className="text-white w-10 h-10" strokeWidth={2.5} />
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">FitBattle AI</h1>
            <p className="text-gray-500 text-sm mt-1 tracking-wide">DISCIPLINA · DOLOR · PROGRESO</p>
          </div>

          {/* Texto de bienvenida */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-1">Bienvenido de nuevo</h2>
            <p className="text-gray-400 text-sm">Inicia sesión para continuar tu transformación</p>
          </div>

          {/* Formulario */}
          <form className="space-y-4 flex-1" onSubmit={handleLogin}>
            {error && <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded-xl text-sm text-center">{error}</div>}

            {/* Campo Email */}
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent-red transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo o nombre de usuario"
                className="w-full bg-white/[0.06] border border-white/[0.08] rounded-2xl pl-12 pr-4 py-4 text-white text-[15px] placeholder:text-gray-600 focus:outline-none focus:border-accent-red/50 focus:bg-white/[0.08] transition-all duration-300"
              />
            </div>

            {/* Campo Contraseña */}
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent-red transition-colors">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full bg-white/[0.06] border border-white/[0.08] rounded-2xl pl-12 pr-12 py-4 text-white text-[15px] placeholder:text-gray-600 focus:outline-none focus:border-accent-red/50 focus:bg-white/[0.08] transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Recordar y Olvidé */}
            <div className="flex justify-between items-center pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <div className="w-5 h-5 rounded-md border border-white/15 bg-white/5 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-sm bg-accent-red"></div>
                </div>
                <span className="text-sm text-gray-400">Recordarme</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-accent-red font-medium hover:text-white transition-colors">
                ¿Olvidaste?
              </Link>
            </div>

            {/* Botón Iniciar Sesión */}
            <div className="pt-4">
              <button
                type="submit"
                className="group relative block w-full text-center py-4 rounded-2xl font-bold text-white overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent-red via-accent-crimson to-accent-red bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite]"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <span className="text-[15px]">Iniciar Sesión</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>


          </form>

          {/* Enlace al registro */}
          <div className="mt-auto pt-8 text-center">
            <p className="text-sm text-gray-500">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-accent-red font-semibold hover:text-white transition-colors">
                Crear una
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
