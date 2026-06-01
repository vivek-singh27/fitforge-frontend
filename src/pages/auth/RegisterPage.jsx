import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { register } from '../../api/authApi';

export default function RegisterPage() {
  const [form, setForm]       = useState({ username:'', email:'', password:'' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser }         = useAuth();
  const navigate              = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await register(form);
      loginUser(res.data);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width:'100%', padding:'11px 14px',
    background:'rgba(0,212,255,0.05)',
    border:'1px solid rgba(0,212,255,0.2)',
    borderRadius:'8px', color:'#e8f4ff',
    fontFamily:'Rajdhani,sans-serif', fontSize:'15px',
    fontWeight:'500', outline:'none',
    transition:'all 0.3s', boxSizing:'border-box',
    colorScheme:'dark',
  };

  const labelStyle = {
    display:'block', fontSize:'11px', color:'#7a9bb5',
    letterSpacing:'2px', fontFamily:'Orbitron,monospace',
    marginBottom:'7px'
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = '#00d4ff';
    e.target.style.background  = 'rgba(0,212,255,0.08)';
    e.target.style.boxShadow   = '0 0 0 3px rgba(0,212,255,0.08)';
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = 'rgba(0,212,255,0.2)';
    e.target.style.background  = 'rgba(0,212,255,0.05)';
    e.target.style.boxShadow   = 'none';
  };

  return (
    <div style={{
      minHeight:'100vh', background:'#050810',
      display:'flex', alignItems:'center', justifyContent:'center',
      padding:'20px', position:'relative', overflow:'hidden',
      fontFamily:'Rajdhani, sans-serif',
    }}>

      {/* Glow orbs */}
      <div style={{ position:'absolute', top:'-100px', left:'-100px',
        width:'350px', height:'350px', borderRadius:'50%',
        background:'rgba(0,212,255,0.05)', filter:'blur(80px)',
        pointerEvents:'none' }}/>
      <div style={{ position:'absolute', bottom:'-100px', right:'-100px',
        width:'300px', height:'300px', borderRadius:'50%',
        background:'rgba(255,107,53,0.04)', filter:'blur(80px)',
        pointerEvents:'none' }}/>

      <div style={{ width:'100%', maxWidth:'400px',
        position:'relative', zIndex:1 }}>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'24px' }}>
          <div style={{ display:'inline-flex', alignItems:'center',
            justifyContent:'center', width:'48px', height:'48px',
            background:'linear-gradient(135deg,#00d4ff,#ff6b35)',
            borderRadius:'12px', marginBottom:'14px',
            boxShadow:'0 0 30px rgba(0,212,255,0.25)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="#050810" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6.5 6.5h11M6.5 17.5h11M4 12h16"/>
            </svg>
          </div>
          <div style={{ fontFamily:'Orbitron,monospace', fontSize:'22px',
            fontWeight:'900', letterSpacing:'3px',
            background:'linear-gradient(135deg,#00d4ff,#ff6b35)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            FITFORGE
          </div>
          <div style={{ fontSize:'11px', color:'#7a9bb5',
            letterSpacing:'3px', marginTop:'4px' }}>
            CREATE YOUR ACCOUNT
          </div>
        </div>

        {/* Card */}
        <div style={{ background:'#0d1528',
          border:'1px solid rgba(0,212,255,0.15)',
          borderRadius:'16px', padding:'28px',
          boxShadow:'0 20px 60px rgba(0,0,0,0.4)' }}>

          {/* Error */}
          {error && (
            <div style={{ marginBottom:'16px', padding:'11px 14px',
              borderRadius:'8px', background:'rgba(255,107,53,0.08)',
              border:'1px solid rgba(255,107,53,0.25)',
              color:'#ff6b35', fontSize:'13px' }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Username */}
            <div style={{ marginBottom:'14px' }}>
              <label style={labelStyle}>USERNAME</label>
              <input type="text" required
                placeholder="e.g. vivek123"
                value={form.username}
                onChange={e => setForm({...form, username: e.target.value})}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}/>
            </div>

            {/* Email */}
            <div style={{ marginBottom:'14px' }}>
              <label style={labelStyle}>EMAIL</label>
              <input type="email" required
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}/>
            </div>

            {/* Password */}
            <div style={{ marginBottom:'22px' }}>
              <label style={labelStyle}>PASSWORD</label>
              <input type="password" required
                placeholder="••••••••" minLength={6}
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}/>
              <div style={{ fontSize:'11px', color:'#7a9bb5',
                marginTop:'6px', paddingLeft:'2px' }}>
                Minimum 6 characters
              </div>
            </div>

            {/* Button */}
            <button type="submit" disabled={loading}
              style={{
                width:'100%', padding:'13px',
                background: loading
                  ? 'rgba(0,212,255,0.3)'
                  : 'linear-gradient(135deg,#00d4ff,#0099cc)',
                color:'#050810', border:'none', borderRadius:'8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily:'Orbitron,monospace', fontSize:'12px',
                fontWeight:'700', letterSpacing:'2px',
                transition:'all 0.3s', boxSizing:'border-box',
                boxShadow: loading ? 'none' : '0 6px 20px rgba(0,212,255,0.25)',
              }}
              onMouseEnter={e => {
                if (!loading) e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
              {loading ? 'CREATING ACCOUNT...' : 'REGISTER'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display:'flex', alignItems:'center',
            gap:'12px', margin:'20px 0' }}>
            <div style={{ flex:1, height:'1px',
              background:'rgba(0,212,255,0.1)' }}/>
            <span style={{ fontSize:'11px', color:'#7a9bb5',
              letterSpacing:'2px' }}>OR</span>
            <div style={{ flex:1, height:'1px',
              background:'rgba(0,212,255,0.1)' }}/>
          </div>

          {/* Login link */}
          <div style={{ textAlign:'center' }}>
            <span style={{ fontSize:'13px', color:'#7a9bb5' }}>
              Already have an account?{' '}
            </span>
            <Link to="/login" style={{ color:'#00d4ff',
              textDecoration:'none', fontFamily:'Orbitron,monospace',
              fontSize:'11px', fontWeight:'700', letterSpacing:'1px' }}>
              LOGIN →
            </Link>
          </div>
        </div>

        {/* Bottom tag */}
        <div style={{ textAlign:'center', marginTop:'16px',
          fontSize:'10px', color:'#7a9bb5',
          letterSpacing:'2px', opacity:0.4 }}>
          BUILT WITH SPRING BOOT · REACT · MYSQL
        </div>
      </div>
    </div>
  );
}