import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout          from './components/AppLayout';
import LandingPage        from './pages/LandingPage';
import LoginPage          from './pages/auth/LoginPage';
import RegisterPage       from './pages/auth/RegisterPage';
import DashboardPage      from './pages/dashboard/DashboardPage';
import ProfilePage        from './pages/profile/ProfilePage';
import GoalPage           from './pages/goal/GoalPage';
import PlanPage           from './pages/plan/PlanPage';
import ProgressPage       from './pages/progress/ProgressPage';
import CalorieTrackerPage from './pages/tracker/CalorieTrackerPage';
import BmiPage            from './pages/bmi/BmiPage';
import NotFoundPage from './pages/NotFoundPage';
import WorkoutHistoryPage from './pages/workout/WorkoutHistoryPage';
import ChatbotPage from './pages/chat/ChatbotPage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'center',
      height:'100vh', background:'#050810', color:'#00d4ff',
      fontFamily:'Orbitron,monospace', fontSize:'13px', letterSpacing:'3px'
    }}>
      INITIALIZING...
    </div>
  );

  if (!user) return <Navigate to="/login" />;

  // Wrap every protected page with the sidebar layout
  return <AppLayout>{children}</AppLayout>;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* ── Public routes (no sidebar) ── */}
          <Route path="/"         element={<LandingPage />} />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ── Protected routes (sidebar shown) ── */}
          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          }/>
          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          }/>
          <Route path="/goal" element={
            <ProtectedRoute><GoalPage /></ProtectedRoute>
          }/>
          <Route path="/plans" element={
            <ProtectedRoute><PlanPage /></ProtectedRoute>
          }/>
          <Route path="/progress" element={
            <ProtectedRoute><ProgressPage /></ProtectedRoute>
          }/>
          <Route path="/calories" element={
            <ProtectedRoute><CalorieTrackerPage /></ProtectedRoute>
          }/>
          <Route path="/bmi" element={
            <ProtectedRoute><BmiPage /></ProtectedRoute>
          }/>

          <Route path="/chat" element={
             <ProtectedRoute><ChatbotPage /></ProtectedRoute>
            }/>


          <Route path="/workouts" element={
  <ProtectedRoute><WorkoutHistoryPage /></ProtectedRoute>
}/>

          {/* ── Catch all unknown routes ── */}
          <Route path="*" element={<NotFoundPage />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}