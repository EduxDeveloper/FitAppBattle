import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Send, Paperclip, Smile, ChevronLeft, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../utils/api';

const GroupChat = () => {
  const [searchParams] = useSearchParams();
  const challengeId = searchParams.get('challengeId');
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([]);
  const [challenge, setChallenge] = useState(null);
  const [participantsCount, setParticipantsCount] = useState(0);
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!challengeId) return;

    const fetchChatData = async () => {
      try {
        const [chRes, mRes, pRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/challenges`),
          fetch(`${API_BASE_URL}/api/messages?challengeId=${challengeId}`),
          fetch(`${API_BASE_URL}/api/challenge-participants?challengeId=${challengeId}`)
        ]);

        if (chRes.ok) {
          const allChallenges = await chRes.json();
          const curr = allChallenges.find(c => c._id === challengeId);
          setChallenge(curr);
        }
        if (mRes.ok) {
          setMessages(await mRes.json());
        }
        if (pRes.ok) {
          const parts = await pRes.json();
          setParticipantsCount(parts.length);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchChatData();
    
    // Simple polling for new messages every 3 seconds
    const interval = setInterval(fetchChatData, 3000);
    return () => clearInterval(interval);
  }, [challengeId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!msg.trim() || !user || !challengeId) return;
    try {
      await fetch(`${API_BASE_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId,
          userId: user._id,
          content: msg
        })
      });
      setMsg('');
      // Optimistically fetch messages
      const mRes = await fetch(`${API_BASE_URL}/api/messages?challengeId=${challengeId}`);
      if (mRes.ok) setMessages(await mRes.json());
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-[calc(100dvh-10rem)] flex flex-col glass rounded-3xl overflow-hidden">
      <div className="p-4 border-b border-white/10 bg-black/20 flex items-center gap-3">
        <Link to="/challenges" className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-400" />
        </Link>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-white">{challenge ? `${challenge.title} ${challenge.emoji}` : 'Cargando...'}</h2>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Users className="w-3 h-3" /> {participantsCount} participantes
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
        {messages.map((m, i) => {
          const isMe = user && m.userId && (m.userId._id === user._id || m.userId === user._id);
          const userName = m.userId?.name || 'Usuario';
          const time = new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return (
            <div key={m._id || i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <span className="text-[10px] text-gray-500 mb-1 px-1">{isMe ? 'Tú' : userName} • {time}</span>
              <div className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm ${isMe ? 'bg-accent-red text-white rounded-br-sm' : 'bg-white/10 text-gray-200 rounded-bl-sm'}`}>
                {m.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-white/10 bg-black/20">
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Smile className="w-5 h-5" />
          </button>
          <input 
            type="text" 
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe un mensaje..." 
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-red"
          />
          <button onClick={handleSend} className="p-2.5 bg-accent-red text-white rounded-full hover:bg-accent-crimson transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;
