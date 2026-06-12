import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyCode from './pages/auth/VerifyCode';
import ForgotPassword from './pages/auth/ForgotPassword';

// Main Pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import FoodScanner from './pages/FoodScanner';
import Calendar from './pages/Calendar';
import DailyView from './pages/DailyView';
import Statistics from './pages/Statistics';
import Challenges from './pages/Challenges';
import GroupChat from './pages/GroupChat';
import Settings from './pages/Settings';
import Privacy from './pages/Privacy';

function App() {
  return (
      <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Main App Routes with Layout */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/food-scanner" element={<FoodScanner />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/daily-view" element={<DailyView />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/group-chat" element={<GroupChat />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/privacy" element={<Privacy />} />
        </Route>
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
