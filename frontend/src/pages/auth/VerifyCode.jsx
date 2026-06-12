import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';
import { API_BASE_URL } from '../../utils/api';

const VerifyCode = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length < 6) return Swal.fire('Error', 'Ingresa el código completo', 'error');

    try {
      Swal.fire({ title: 'Verificando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      
      const res = await fetch(`${API_BASE_URL}/api/register/verifyCodeEmail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ verificationCodeRequest: fullCode })
      });
      if (res.ok) {
        Swal.fire({ icon: 'success', title: 'Cuenta creada', text: 'Ahora puedes iniciar sesión', background: '#111', color: '#fff', timer: 2000 });
        navigate('/login');
      } else {
        const data = await res.json();
        Swal.fire('Error', data.message || 'Código inválido', 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'Error de conexión', 'error');
    }
  };

  return (
    <div className="flex justify-center min-h-[100dvh] bg-black">
      <div className="w-full max-w-md min-h-[100dvh] bg-background relative overflow-hidden flex flex-col">

        <div className="absolute top-[10%] left-[-20%] w-72 h-72 bg-accent-red/15 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[-15%] w-64 h-64 bg-accent-purple/20 rounded-full blur-[100px] animate-pulse [animation-delay:2s]"></div>

        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-red to-transparent"></div>

        <div className="relative z-10 flex flex-col flex-1 px-6 pt-12 pb-8">

          <Link to="/register" className="flex items-center gap-1 text-gray-500 hover:text-white transition-colors mb-8 w-fit">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Volver</span>
          </Link>

          <div className="flex flex-col items-center mb-10">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-accent-red/20 rounded-full blur-2xl scale-[2]"></div>
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-accent-red/20 to-accent-purple/20 border border-white/10 flex items-center justify-center">
                <ShieldCheck className="w-10 h-10 text-accent-red" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Verifica tu correo</h2>
            <p className="text-gray-400 text-sm text-center leading-relaxed">
              Enviamos un código de 6 dígitos a<br/>
              <span className="text-white font-medium">alex@example.com</span>
            </p>
          </div>

          <div className="flex justify-center gap-2.5 mb-8">
            {code.map((digit, i) => (
              <div key={i} className="relative">
                <input
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase())}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className={`w-12 h-14 rounded-2xl text-center text-xl font-bold transition-all duration-300 focus:outline-none ${
                    digit
                      ? 'bg-accent-red/10 border-2 border-accent-red/50 text-white shadow-lg shadow-accent-red/10'
                      : 'bg-white/[0.06] border border-white/[0.08] text-white focus:border-accent-red/50 focus:bg-white/[0.08]'
                  }`}
                />
                {!digit && (
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/20"></div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-full px-5 py-2.5">
              <div className="w-2 h-2 rounded-full bg-accent-red animate-pulse"></div>
              <span className="text-sm text-gray-400">El código expira en</span>
              <span className="text-sm font-bold text-white font-mono">04:59</span>
            </div>
          </div>

          <button
            onClick={handleVerify}
            className="group relative block w-full text-center py-4 rounded-2xl font-bold text-white overflow-hidden mb-4"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-accent-red via-accent-crimson to-accent-red bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite]"></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10"></div>
            <div className="relative flex items-center justify-center gap-2">
              <span className="text-[15px]">Verificar y Continuar</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <div className="text-center mt-2">
            <p className="text-sm text-gray-500 mb-3">¿No recibiste el código?</p>
            <button className="text-sm text-accent-red font-semibold hover:text-white transition-colors">
              Reenviar Código
            </button>
          </div>

          <div className="mt-auto pt-8">
            <div className="glass rounded-2xl p-4 flex items-start gap-3 border border-white/5">
              <ShieldCheck className="w-5 h-5 text-success shrink-0 mt-0.5" />
              <p className="text-xs text-gray-500 leading-relaxed">
                Tus datos están cifrados de extremo a extremo. Nunca compartimos tu información personal con terceros.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;
