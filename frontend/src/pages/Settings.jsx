import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';
import { User, Lock, Moon, Sun, LogOut, ChevronRight, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { API_BASE_URL } from '../utils/api';

const Settings = () => {
  const { logout, user, darkMode, toggleTheme } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: "Tendrás que volver a ingresar tus credenciales.",
      icon: 'warning',
      showCancelButton: true,
      background: darkMode ? '#111' : '#fff',
      color: darkMode ? '#fff' : '#111',
      confirmButtonColor: '#ff2a5f',
      cancelButtonColor: darkMode ? '#333' : '#ccc',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await logout();
        navigate('/login');
      }
    });
  };

  const handleChangePassword = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Cambiar Contraseña',
      html:
        `<div style="display:flex;flex-direction:column;gap:12px;text-align:left;">
          <div>
            <label style="font-size:13px;color:#999;margin-bottom:4px;display:block;">Contraseña actual</label>
            <input id="swal-current" type="password" class="swal2-input" placeholder="••••••••" style="margin:0;width:100%;box-sizing:border-box;">
          </div>
          <div>
            <label style="font-size:13px;color:#999;margin-bottom:4px;display:block;">Nueva contraseña</label>
            <input id="swal-new" type="password" class="swal2-input" placeholder="Mínimo 6 caracteres" style="margin:0;width:100%;box-sizing:border-box;">
          </div>
          <div>
            <label style="font-size:13px;color:#999;margin-bottom:4px;display:block;">Confirmar nueva contraseña</label>
            <input id="swal-confirm" type="password" class="swal2-input" placeholder="Repite la contraseña" style="margin:0;width:100%;box-sizing:border-box;">
          </div>
        </div>`,
      focusConfirm: false,
      background: darkMode ? '#111' : '#fff',
      color: darkMode ? '#fff' : '#111',
      confirmButtonColor: '#ff2a5f',
      confirmButtonText: 'Cambiar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: darkMode ? '#333' : '#ccc',
      preConfirm: () => {
        const currentPassword = document.getElementById('swal-current').value;
        const newPassword = document.getElementById('swal-new').value;
        const confirmNewPassword = document.getElementById('swal-confirm').value;

        if (!currentPassword || !newPassword || !confirmNewPassword) {
          Swal.showValidationMessage('Todos los campos son obligatorios');
          return false;
        }
        if (newPassword.length < 6) {
          Swal.showValidationMessage('La nueva contraseña debe tener al menos 6 caracteres');
          return false;
        }
        if (newPassword !== confirmNewPassword) {
          Swal.showValidationMessage('Las contraseñas no coinciden');
          return false;
        }

        return { currentPassword, newPassword, confirmNewPassword };
      }
    });

    if (formValues) {
      try {
        Swal.fire({ title: 'Actualizando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

        const response = await fetch(`${API_BASE_URL}/api/users/${user._id}/change-password`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(formValues)
        });

        const data = await response.json();

        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: '¡Contraseña actualizada!',
            text: 'Tu contraseña ha sido cambiada correctamente.',
            background: darkMode ? '#111' : '#fff',
            color: darkMode ? '#fff' : '#111',
            confirmButtonColor: '#ff2a5f',
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.message || 'No se pudo cambiar la contraseña',
            background: darkMode ? '#111' : '#fff',
            color: darkMode ? '#fff' : '#111',
            confirmButtonColor: '#ff2a5f'
          });
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: 'No se pudo contactar al servidor.',
          background: darkMode ? '#111' : '#fff',
          color: darkMode ? '#fff' : '#111',
          confirmButtonColor: '#ff2a5f'
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-adaptive-primary mb-2">Ajustes</h1>
      
      <GlassCard>
        <h2 className="text-lg font-bold text-adaptive-primary mb-4">Cuenta</h2>
        <div className="space-y-3">
          <Link to="/profile" className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-accent-red" />
              <div>
                <h3 className="font-medium text-adaptive-primary text-sm">Foto de Perfil</h3>
                <p className="text-xs text-adaptive-secondary">Actualiza tu avatar</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-adaptive-secondary" />
          </Link>
          
          <button 
            onClick={handleChangePassword}
            className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-accent-purple" />
              <div className="text-left">
                <h3 className="font-medium text-adaptive-primary text-sm">Contraseña</h3>
                <p className="text-xs text-adaptive-secondary">Cambia tus credenciales</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-adaptive-secondary" />
          </button>
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="text-lg font-bold text-adaptive-primary mb-4">Preferencias</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="w-5 h-5 text-accent-purple" /> : <Sun className="w-5 h-5 text-warning" />}
              <div>
                <h3 className="font-medium text-adaptive-primary text-sm">{darkMode ? 'Modo Oscuro' : 'Modo Claro'}</h3>
                <p className="text-xs text-adaptive-secondary">{darkMode ? 'Abraza la oscuridad' : 'Deja entrar la luz'}</p>
              </div>
            </div>
            <button 
              onClick={toggleTheme}
              className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${darkMode ? 'bg-accent-red' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${darkMode ? 'right-1' : 'left-1'}`}></div>
            </button>
          </div>
          
          <Link to="/privacy" className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-success" />
              <div>
                <h3 className="font-medium text-adaptive-primary text-sm">Privacidad</h3>
                <p className="text-xs text-adaptive-secondary">Datos y visibilidad</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-adaptive-secondary" />
          </Link>
        </div>
      </GlassCard>

      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 w-full py-3 glass rounded-2xl text-accent-red font-semibold hover:bg-white/10 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Settings;
