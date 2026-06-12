import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';
import { Upload, Camera, Save, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { API_BASE_URL } from '../utils/api';

const FoodScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);
  const [mealType, setMealType] = useState('Desayuno');
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSaveMeal = async () => {
    if (!scannedResult || !user) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/meal-logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          foodItemId: scannedResult._id,
          date: new Date(),
          mealType: mealType,
          servingSizeG: scannedResult.servingSizeG,
          calories: scannedResult.calories,
          proteinG: scannedResult.proteinG,
          carbsG: scannedResult.carbsG,
          fatsG: scannedResult.fatsG,
        }),
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: '¡Guardado!',
          text: 'Comida agregada al registro diario.',
          background: '#111',
          color: '#fff',
          confirmButtonColor: '#ff2a5f',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          navigate('/dashboard');
        });
      } else {
        setError('Error al guardar comida');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setIsScanning(true);
      setError('');
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/ai-scan/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64: base64Image,
            mimeType: file.type
          }),
          credentials: "include"
        });

        const result = await response.json();
        
        if (response.ok) {
          setScannedResult(result.data);
        } else {
          setError(result.message || "Error al escanear");
        }
      } catch (err) {
        setError("Error de conexión con el servidor");
      } finally {
        setIsScanning(false);
      }
    };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Escáner de Comida IA</h1>
        <p className="text-sm text-gray-400">Toma una foto para registrar macros instantáneamente.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <GlassCard className="flex flex-col items-center justify-center p-8 border-dashed border-2 border-white/20">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <Camera className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1">Subir o Tomar Foto</h3>
          <p className="text-xs text-gray-400 text-center mb-5">Arrastra y suelta una imagen aquí, o haz clic abajo.</p>
          
          <input 
            type="file" 
            accept="image/*" 
            id="file-upload" 
            className="hidden" 
            onChange={handleImageUpload}
          />
          <label 
            htmlFor="file-upload"
            className={`px-6 py-3 bg-gradient-to-r from-accent-red to-accent-crimson rounded-xl font-semibold text-white shadow-lg shadow-accent-red/20 w-full hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm cursor-pointer ${isScanning ? 'opacity-50 pointer-events-none' : ''}`}
          >
            {isScanning ? (
              <span className="animate-pulse">Analizando Imagen...</span>
            ) : (
              <>
                <Upload className="w-5 h-5" /> Seleccionar Imagen
              </>
            )}
          </label>
          {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
        </GlassCard>

        <GlassCard>
          <h2 className="text-lg font-bold text-white mb-4">Resultados de Detección</h2>
          
          {scannedResult ? (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-white">{scannedResult.name}</h3>
                <span className="text-xs text-success bg-success/10 px-2 py-1 rounded-full mt-1 inline-block">
                  {scannedResult.confidence}% de coincidencia
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-gray-400 text-xs">Calorías</div>
                  <div className="text-xl font-bold text-white">{scannedResult.calories}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-gray-400 text-xs">Proteínas</div>
                  <div className="text-xl font-bold text-accent-purple">{scannedResult.proteinG}g</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-gray-400 text-xs">Carbos</div>
                  <div className="text-xl font-bold text-accent-red">{scannedResult.carbsG}g</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-gray-400 text-xs">Grasas</div>
                  <div className="text-xl font-bold text-warning">{scannedResult.fatsG}g</div>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-2 block">Tipo de Comida</label>
                <select 
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-accent-red"
                >
                  <option value="Desayuno">Desayuno</option>
                  <option value="Comida">Comida</option>
                  <option value="Cena">Cena</option>
                  <option value="Snack">Snack</option>
                </select>
              </div>

              <button 
                onClick={handleSaveMeal}
                className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold text-white transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Save className="w-5 h-5" /> Guardar en Historial
              </button>
            </div>
          ) : (
            <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-gray-500">
              <Upload className="w-10 h-10 mb-3 opacity-50" />
              <p className="text-sm">Esperando imagen...</p>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Quick link */}
      <Link to="/daily-view" className="glass rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors">
        <span className="text-sm font-medium text-gray-300">Ver registro de comida de hoy</span>
        <ChevronRight className="w-5 h-5 text-gray-500" />
      </Link>
    </div>
  );
};

export default FoodScanner;
