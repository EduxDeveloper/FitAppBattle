import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ChevronLeft, ChevronRight, KeyRound, Lock, ShieldCheck } from 'lucide-react';
import Swal from 'sweetalert2';
import { API_BASE_URL } from '../../utils/api';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [passwords, setPasswords] = useState({ newPassword: '', confirmNewPassword: '' });
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const handleChangeCode = (index, value) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const requestRecovery = async () => {
    if (!email) return;
    try {
      Swal.fire({ title: 'Enviando código...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      const res = await fetch(`${API_BASE_URL}/api/recovery/requestCode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        Swal.close();
        setStep(2);
      } else {
        const data = await res.json();
        Swal.fire('Error', data.message || 'Error', 'error');
      }
    } catch (err) {}
  };

  const verifyCode = async () => {
    const fullCode = code.join('');
    if (fullCode.length < 6) return;
    try {
      Swal.fire({ title: 'Verificando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      const res = await fetch(`${API_BASE_URL}/api/recovery/verifyCode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code: fullCode })
      });
      if (res.ok) {
        Swal.close();
        setStep(3);
      } else {
        Swal.fire('Error', 'Código inválido', 'error');
      }
    } catch (err) {}
  };

  const resetPassword = async () => {
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      return Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
    }
    try {
      Swal.fire({ title: 'Actualizando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      const res = await fetch(`${API_BASE_URL}/api/recovery/newPassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(passwords)
      });
      if (res.ok) {
        Swal.fire({ icon: 'success', title: 'Contraseña actualizada', text: 'Ahora puedes iniciar sesión', background: '#111', color: '#fff', timer: 2000 });
        navigate('/login');
      } else {
        const data = await res.json();
        Swal.fire('Error', data.message || 'Error', 'error');
      }
    } catch (err) {}
  };
  return (
    <div className="flex justify-center min-h-[100dvh] bg-black">
      <div className="w-full max-w-md min-h-[100dvh] bg-background relative overflow-hidden flex flex-col">

        {/* Orbes de fondo */}
        <div className="absolute top-[20%] left-[-25%] w-80 h-80 bg-accent-purple/15 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[15%] right-[-20%] w-64 h-64 bg-accent-red/15 rounded-full blur-[100px] animate-pulse [animation-delay:1.5s]"></div>

        {/* Acento superior */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-purple to-transparent"></div>

        <div className="relative z-10 flex flex-col flex-1 px-6 pt-12 pb-8">

          {/* Atrás */}
          <Link to="/login" className="flex items-center gap-1 text-gray-500 hover:text-white transition-colors mb-8 w-fit">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Volver a inicio de sesión</span>
          </Link>

          {/* Icono y Encabezado */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-accent-purple/20 rounded-full blur-2xl scale-[2]"></div>
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-accent-purple/20 to-accent-red/20 border border-white/10 flex items-center justify-center">
                <KeyRound className="w-10 h-10 text-accent-purple" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">¿Olvidaste tu contraseña?</h2>
            <p className="text-gray-400 text-sm text-center leading-relaxed max-w-[280px]">
              No te preocupes. Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
            </p>
          </div>

          {/* Formulario */}
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>

            {step === 1 && (
              <>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent-purple transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ingresa tu correo electrónico"
                    className="w-full bg-white/[0.06] border border-white/[0.08] rounded-2xl pl-12 pr-4 py-4 text-white text-[15px] placeholder:text-gray-600 focus:outline-none focus:border-accent-purple/50 focus:bg-white/[0.08] transition-all duration-300"
                  />
                </div>
                <button
                  type="button"
                  onClick={requestRecovery}
                  className="group relative block w-full text-center py-4 rounded-2xl font-bold text-white overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-purple via-purple-700 to-accent-purple bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite]"></div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10"></div>
                  <div className="relative flex items-center justify-center gap-2">
                    <span className="text-[15px]">Enviar código de restablecimiento</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="flex justify-center gap-2.5 mb-2">
                  {code.map((digit, i) => (
                    <div key={i} className="relative">
                      <input
                        ref={(el) => (inputRefs.current[i] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleChangeCode(i, e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase())}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        className={`w-12 h-14 rounded-2xl text-center text-xl font-bold transition-all duration-300 focus:outline-none ${
                          digit
                            ? 'bg-accent-purple/10 border-2 border-accent-purple/50 text-white shadow-lg shadow-accent-purple/10'
                            : 'bg-white/[0.06] border border-white/[0.08] text-white focus:border-accent-purple/50 focus:bg-white/[0.08]'
                        }`}
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={verifyCode}
                  className="group relative block w-full text-center py-4 rounded-2xl font-bold text-white overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-purple via-purple-700 to-accent-purple bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite]"></div>
                  <div className="relative flex items-center justify-center gap-2">
                    <span className="text-[15px]">Verificar Código</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </>
            )}

            {step === 3 && (
              <>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent-purple transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                    placeholder="Nueva contraseña"
                    className="w-full bg-white/[0.06] border border-white/[0.08] rounded-2xl pl-12 pr-4 py-4 text-white text-[15px] focus:outline-none focus:border-accent-purple/50 focus:bg-white/[0.08] transition-all duration-300"
                  />
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent-purple transition-colors">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    value={passwords.confirmNewPassword}
                    onChange={(e) => setPasswords({...passwords, confirmNewPassword: e.target.value})}
                    placeholder="Confirmar nueva contraseña"
                    className="w-full bg-white/[0.06] border border-white/[0.08] rounded-2xl pl-12 pr-4 py-4 text-white text-[15px] focus:outline-none focus:border-accent-purple/50 focus:bg-white/[0.08] transition-all duration-300"
                  />
                </div>
                <button
                  type="button"
                  onClick={resetPassword}
                  className="group relative block w-full text-center py-4 rounded-2xl font-bold text-white overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-purple via-purple-700 to-accent-purple bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite]"></div>
                  <div className="relative flex items-center justify-center gap-2">
                    <span className="text-[15px]">Guardar Contraseña</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </>
            )}
          </form>

          {/* Sección de ayuda */}
          <div className="mt-10 space-y-4">
            <div className="glass rounded-2xl p-4 border border-white/5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-sm">📬</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-0.5">Revisa tu carpeta de spam</p>
                  <p className="text-xs text-gray-500 leading-relaxed">A veces los correos terminan en spam. Busca allí si no lo ves en tu bandeja de entrada.</p>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-4 border border-white/5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-sm">🔑</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-0.5">Usa una contraseña segura</p>
                  <p className="text-xs text-gray-500 leading-relaxed">Tu nueva contraseña debe tener al menos 8 caracteres, números y símbolos.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pie de página */}
          <div className="mt-auto pt-8 text-center">
            <p className="text-sm text-gray-500">
              ¿Recuerdas tu contraseña?{' '}
              <Link to="/login" className="text-accent-purple font-semibold hover:text-white transition-colors">
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
