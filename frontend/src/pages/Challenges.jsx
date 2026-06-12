import { Link } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';
import { Trophy, Users, Clock, Plus, MessageSquare, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { API_BASE_URL } from '../utils/api';

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [participants, setParticipants] = useState([]);
  const { user } = useAuth();

  const fetchChallenges = async () => {
    try {
      const [chRes, pRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/challenges`),
        fetch(`${API_BASE_URL}/api/challenge-participants`)
      ]);
      if (chRes.ok) setChallenges(await chRes.json());
      if (pRes.ok) setParticipants(await pRes.json());
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleJoin = async (challengeId) => {
    try {
      await fetch(`${API_BASE_URL}/api/challenge-participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId,
          userId: user._id,
          totalScore: 0
        })
      });
      fetchChallenges();
      Swal.fire({ icon: 'success', title: '¡Te uniste al reto!', background: '#111', color: '#fff', showConfirmButton: false, timer: 1500 });
    } catch (err) {}
  };

  const handleCreate = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Crear Nuevo Reto',
      html:
        '<input id="swal-title" class="swal2-input" placeholder="Nombre del reto">' +
        '<input id="swal-desc" class="swal2-input" placeholder="Descripción">',
      focusConfirm: false,
      background: '#111',
      color: '#fff',
      confirmButtonColor: '#ff2a5f',
      preConfirm: () => {
        return {
          title: document.getElementById('swal-title').value,
          description: document.getElementById('swal-desc').value
        }
      }
    });

    if (formValues && formValues.title) {
      try {
        await fetch(`${API_BASE_URL}/api/challenges`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formValues.title,
            description: formValues.description,
            creatorId: user._id,
            maxParticipants: 10,
            emoji: '🏆'
          })
        });
        fetchChallenges();
        Swal.fire({ icon: 'success', title: 'Reto creado', background: '#111', color: '#fff', showConfirmButton: false, timer: 1500 });
      } catch (err) {}
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Retos Activos</h1>
          <p className="text-sm text-gray-400">Compite con amigos y supera tus límites.</p>
        </div>
        <button onClick={handleCreate} className="p-2.5 bg-gradient-to-r from-accent-red to-accent-crimson rounded-xl font-semibold text-white shadow-lg shadow-accent-red/20 hover:opacity-90">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {challenges.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No hay retos disponibles. ¡Crea el primero!</p>
        ) : (
          challenges.map((challenge, index) => {
            const chParticipants = participants.filter(p => p.challengeId === challenge._id);
            const isJoined = chParticipants.some(p => p.userId?._id === user._id || p.userId === user._id);
            
            return (
              <GlassCard key={challenge._id} className={`border-t-4 ${index % 2 === 0 ? 'border-t-warning' : 'border-t-accent-purple'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{challenge.title} {challenge.emoji}</h3>
                    <p className="text-sm text-gray-400">{challenge.description}</p>
                  </div>
                  <Trophy className={`${index % 2 === 0 ? 'text-warning' : 'text-accent-purple'} w-8 h-8 opacity-80`} />
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-300 mb-6">
                  <div className="flex items-center gap-1"><Users className="w-4 h-4" /> {chParticipants.length}/{challenge.maxParticipants || 10}</div>
                  <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> Activo</div>
                </div>

                {isJoined ? (
                  <Link 
                    to={`/group-chat?challengeId=${challenge._id}`} 
                    className={`flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl font-semibold transition-colors ${index % 2 === 0 ? 'text-warning' : 'text-accent-purple'}`}
                  >
                    <MessageSquare className="w-5 h-5" /> Abrir Chat de Grupo
                  </Link>
                ) : (
                  <button 
                    onClick={() => handleJoin(challenge._id)}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-accent-red to-accent-crimson rounded-xl font-semibold text-white shadow-lg shadow-accent-red/20 hover:opacity-90 transition-opacity"
                  >
                    Unirse al Reto
                  </button>
                )}
              </GlassCard>
            );
          })
        )}
      </div>

      {/* Quick links */}
      <Link to="/statistics" className="glass rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors">
        <span className="text-sm font-medium text-gray-300">Ver tus estadísticas de rendimiento</span>
        <ChevronRight className="w-5 h-5 text-gray-500" />
      </Link>
    </div>
  );
};

export default Challenges;
