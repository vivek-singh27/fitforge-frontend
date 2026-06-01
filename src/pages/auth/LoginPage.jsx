import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../api/authApi';

export default function LoginPage() {
  const [form, setForm]     = useState({ email:'', password:'' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser }       = useAuth();
  const navigate            = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(form);
      loginUser(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050810',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Rajdhani, sans-serif',
    }}>

      {/* Background glow orbs */}
      <div style={{ position:'absolute', top:'-150px', right:'-150px',
        width:'500px', height:'500px', borderRadius:'50%',
        background:'rgba(0,212,255,0.06)', filter:'blur(100px)',
        pointerEvents:'none' }}/>
      <div style={{ position:'absolute', bottom:'-150px', left:'-150px',
        width:'400px', height:'400px', borderRadius:'50%',
        background:'rgba(255,107,53,0.05)', filter:'blur(100px)',
        pointerEvents:'none' }}/>

      <div style={{ width:'100%', maxWidth:'420px', position:'relative', zIndex:1 }}>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'40px' }}>
          <div style={{ display:'inline-flex', alignItems:'center',
            justifyContent:'center', width:'64px', height:'64px',
            background:'linear-gradient(135deg,#00d4ff,#ff6b35)',
            borderRadius:'16px', marginBottom:'20px',
            boxShadow:'0 0 40px rgba(0,212,255,0.3)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
              stroke="#050810" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6.5 6.5h11M6.5 17.5h11M4 12h16"/>
            </svg>
          </div>
          <div style={{ fontFamily:'Orbitron,monospace', fontSize:'28px',
            fontWeight:'900', letterSpacing:'3px',
            background:'linear-gradient(135deg,#00d4ff,#ff6b35)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            FITFORGE
          </div>
          <div style={{ fontSize:'12px', color:'#7a9bb5',
            letterSpacing:'4px', marginTop:'6px' }}>
            SIGN IN TO YOUR ACCOUNT
          </div>
        </div>

        {/* Card */}
        <div style={{ background:'#0d1528',
          border:'1px solid rgba(0,212,255,0.15)',
          borderRadius:'20px', padding:'32px',
          boxShadow:'0 24px 64px rgba(0,0,0,0.4)' }}>

          {/* Error */}
          {error && (
            <div style={{ marginBottom:'24px', padding:'14px 18px',
              borderRadius:'10px', background:'rgba(255,107,53,0.08)',
              border:'1px solid rgba(255,107,53,0.25)',
              color:'#ff6b35', fontSize:'14px', fontWeight:'500' }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom:'20px' }}>
              <label style={{ display:'block', fontSize:'12px', color:'#7a9bb5',
                letterSpacing:'2px', fontFamily:'Orbitron,monospace',
                marginBottom:'10px' }}>
                EMAIL
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                style={{
                  width:'100%', padding:'16px 20px',
                  background:'rgba(0,212,255,0.05)',
                  border:'1px solid rgba(0,212,255,0.2)',
                  borderRadius:'10px', color:'#e8f4ff',
                  fontFamily:'Rajdhani,sans-serif', fontSize:'16px',
                  fontWeight:'500', outline:'none',
                  transition:'all 0.3s', boxSizing:'border-box',
                  colorScheme:'dark',
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#00d4ff';
                  e.target.style.background  = 'rgba(0,212,255,0.08)';
                  e.target.style.boxShadow   = '0 0 0 3px rgba(0,212,255,0.1)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(0,212,255,0.2)';
                  e.target.style.background  = 'rgba(0,212,255,0.05)';
                  e.target.style.boxShadow   = 'none';
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom:'32px' }}>
              <label style={{ display:'block', fontSize:'12px', color:'#7a9bb5',
                letterSpacing:'2px', fontFamily:'Orbitron,monospace',
                marginBottom:'10px' }}>
                PASSWORD
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                style={{
                  width:'100%', padding:'16px 20px',
                  background:'rgba(0,212,255,0.05)',
                  border:'1px solid rgba(0,212,255,0.2)',
                  borderRadius:'10px', color:'#e8f4ff',
                  fontFamily:'Rajdhani,sans-serif', fontSize:'16px',
                  fontWeight:'500', outline:'none',
                  transition:'all 0.3s', boxSizing:'border-box',
                  colorScheme:'dark',
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#00d4ff';
                  e.target.style.background  = 'rgba(0,212,255,0.08)';
                  e.target.style.boxShadow   = '0 0 0 3px rgba(0,212,255,0.1)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(0,212,255,0.2)';
                  e.target.style.background  = 'rgba(0,212,255,0.05)';
                  e.target.style.boxShadow   = 'none';
                }}
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width:'100%', padding:'16px',
                background: loading
                  ? 'rgba(0,212,255,0.3)'
                  : 'linear-gradient(135deg,#00d4ff,#0099cc)',
                color:'#050810', border:'none',
                borderRadius:'10px', cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily:'Orbitron,monospace', fontSize:'13px',
                fontWeight:'700', letterSpacing:'3px',
                transition:'all 0.3s', boxSizing:'border-box',
                boxShadow: loading ? 'none' : '0 8px 24px rgba(0,212,255,0.3)',
              }}
              onMouseEnter={e => {
                if (!loading) e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {loading ? 'AUTHENTICATING...' : 'LOGIN'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display:'flex', alignItems:'center', gap:'16px',
            margin:'28px 0' }}>
            <div style={{ flex:1, height:'1px',
              background:'rgba(0,212,255,0.1)' }}/>
            <span style={{ fontSize:'12px', color:'#7a9bb5',
              letterSpacing:'2px' }}>OR</span>
            <div style={{ flex:1, height:'1px',
              background:'rgba(0,212,255,0.1)' }}/>
          </div>

          {/* Register link */}
          <div style={{ textAlign:'center' }}>
            <span style={{ fontSize:'14px', color:'#7a9bb5' }}>
              No account?{' '}
            </span>
            <Link to="/register" style={{ color:'#00d4ff',
              textDecoration:'none', fontFamily:'Orbitron,monospace',
              fontSize:'12px', fontWeight:'700', letterSpacing:'1px' }}>
              CREATE ACCOUNT →
            </Link>
          </div>
        </div>

        {/* Bottom tag */}
        <div style={{ textAlign:'center', marginTop:'24px',
          fontSize:'11px', color:'#7a9bb5', letterSpacing:'2px', opacity:0.5 }}>
          BUILT WITH SPRING BOOT · REACT · MYSQL
        </div>
      </div>
    </div>
  );
}