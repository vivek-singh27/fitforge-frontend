import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path:'/dashboard', label:'DASHBOARD', icon:'⊞' },
  { path:'/profile',   label:'PROFILE',   icon:'👤' },
  { path:'/goal',      label:'GOAL',      icon:'🎯' },
  { path:'/plans',     label:'PLANS',     icon:'📋' },
  { path:'/progress',  label:'PROGRESS',  icon:'📈' },
  { path:'/calories',  label:'CALORIES',  icon:'🍽️' },
  { path:'/bmi',       label:'BMI CALC',  icon:'⚡' },
  { path:'/workouts', label:'WORKOUTS', icon:'🏋️' },
  { path:'/chat', label:'FITBOT AI', icon:'🤖' },
];

export default function Navbar() {
  const navigate         = useNavigate();
  const location         = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleNav = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div style={{ padding:'24px 20px 20px',
        borderBottom:'1px solid rgba(0,212,255,0.1)' }}>
        <div style={{ fontFamily:'Orbitron,monospace', fontSize:'18px',
          fontWeight:'900', background:'linear-gradient(135deg,#00d4ff,#ff6b35)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          letterSpacing:'2px' }}>FITFORGE</div>
        <div style={{ fontSize:'10px', color:'#7a9bb5',
          letterSpacing:'3px', marginTop:'3px' }}>SMART PLANNER</div>
      </div>

      {/* Nav items */}
      <nav style={{ flex:1, padding:'12px 0', overflowY:'auto' }}>
        {navItems.map(item => (
          <div key={item.path} onClick={() => handleNav(item.path)}
            style={{ display:'flex', alignItems:'center', gap:'12px',
              padding:'12px 20px', cursor:'pointer',
              borderLeft:`3px solid ${isActive(item.path) ? '#00d4ff' : 'transparent'}`,
              background: isActive(item.path) ? 'rgba(0,212,255,0.08)' : 'transparent',
              color: isActive(item.path) ? '#00d4ff' : '#7a9bb5',
              fontSize:'12px', fontFamily:'Orbitron,monospace',
              fontWeight:'700', letterSpacing:'1px', transition:'all 0.2s' }}
            onMouseEnter={e => {
              if (!isActive(item.path)) {
                e.currentTarget.style.color = '#00d4ff';
                e.currentTarget.style.background = 'rgba(0,212,255,0.04)';
              }
            }}
            onMouseLeave={e => {
              if (!isActive(item.path)) {
                e.currentTarget.style.color = '#7a9bb5';
                e.currentTarget.style.background = 'transparent';
              }
            }}>
            <span style={{ fontSize:'16px' }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>

      {/* User + logout */}
      <div style={{ padding:'16px 20px',
        borderTop:'1px solid rgba(0,212,255,0.1)' }}>
        <div style={{ display:'flex', alignItems:'center',
          gap:'10px', marginBottom:'12px' }}>
          <div style={{ width:'32px', height:'32px', borderRadius:'50%',
            background:'linear-gradient(135deg,#00d4ff,#ff6b35)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:'Orbitron,monospace', fontSize:'12px',
            fontWeight:'700', color:'#050810', flexShrink:0 }}>
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize:'13px', fontWeight:'600',
              color:'#e8f4ff' }}>{user?.username}</div>
            <div style={{ fontSize:'10px', color:'#7a9bb5',
              letterSpacing:'1px' }}>PRO MEMBER</div>
          </div>
        </div>
        <button onClick={logout}
          style={{ width:'100%', background:'rgba(255,107,53,0.08)',
            border:'1px solid rgba(255,107,53,0.2)', color:'#ff6b35',
            borderRadius:'8px', padding:'9px', fontFamily:'Orbitron,monospace',
            fontSize:'10px', fontWeight:'700', letterSpacing:'2px',
            cursor:'pointer', transition:'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background='rgba(255,107,53,0.15)'}
          onMouseLeave={e => e.currentTarget.style.background='rgba(255,107,53,0.08)'}>
          LOGOUT
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="sidebar-desktop" style={{ width:'220px', minHeight:'100vh',
        background:'#0a0f1e', borderRight:'1px solid rgba(0,212,255,0.1)',
        display:'flex', flexDirection:'column', flexShrink:0,
        position:'sticky', top:0, height:'100vh' }}>
        <SidebarContent />
      </div>

      {/* Mobile top bar */}
      <div className="mobile-nav" style={{ position:'fixed', top:0, left:0, right:0,
        height:'56px', background:'#0a0f1e',
        borderBottom:'1px solid rgba(0,212,255,0.1)',
        display:'none', alignItems:'center', justifyContent:'space-between',
        padding:'0 16px', zIndex:1000 }}>
        <div style={{ fontFamily:'Orbitron,monospace', fontSize:'16px',
          fontWeight:'900', background:'linear-gradient(135deg,#00d4ff,#ff6b35)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
          FITFORGE
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background:'transparent', border:'1px solid rgba(0,212,255,0.2)',
            color:'#00d4ff', borderRadius:'8px', padding:'6px 12px',
            fontFamily:'Orbitron,monospace', fontSize:'10px', cursor:'pointer' }}>
          {mobileOpen ? '✕ CLOSE' : '☰ MENU'}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div style={{ position:'fixed', top:'56px', left:0, right:0, bottom:0,
          background:'#0a0f1e', zIndex:999, display:'flex',
          flexDirection:'column', overflowY:'auto' }}>
          <SidebarContent />
        </div>
      )}
    </>
  );
}