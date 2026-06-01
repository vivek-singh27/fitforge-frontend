import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050810',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '40px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Rajdhani, sans-serif'
    }}>

      {/* Background glow orbs */}
      <div style={{
        position: 'absolute', top: '-100px', right: '-100px',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'rgba(0,212,255,0.04)', filter: 'blur(80px)',
        pointerEvents: 'none'
      }}/>
      <div style={{
        position: 'absolute', bottom: '-100px', left: '-100px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'rgba(255,107,53,0.04)', filter: 'blur(80px)',
        pointerEvents: 'none'
      }}/>

      {/* Spinning hex decoration */}
      <svg style={{
        position: 'absolute', top: '40px', right: '60px',
        opacity: 0.1,
        animation: 'spin 20s linear infinite'
      }} width="160" height="160" viewBox="0 0 200 200">
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        <polygon points="100,10 185,55 185,145 100,190 15,145 15,55"
          fill="none" stroke="#00d4ff" strokeWidth="1"/>
        <polygon points="100,30 165,67 165,133 100,170 35,133 35,67"
          fill="none" stroke="#ff6b35" strokeWidth="0.5"/>
      </svg>

      {/* Logo icon */}
      <div style={{
        width: '72px', height: '72px',
        background: 'linear-gradient(135deg, #00d4ff, #ff6b35)',
        borderRadius: '18px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '24px',
        boxShadow: '0 0 40px rgba(0,212,255,0.35)'
      }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
          stroke="#050810" strokeWidth="2.5" strokeLinecap="round">
          <path d="M6.5 6.5h11M6.5 17.5h11M4 12h16"/>
        </svg>
      </div>

      {/* Title */}
      <div style={{
        fontFamily: 'Orbitron, monospace',
        fontSize: '52px',
        fontWeight: '900',
        lineHeight: '1.1',
        marginBottom: '8px',
        letterSpacing: '2px'
      }}>
        <span style={{
          background: 'linear-gradient(135deg, #00d4ff, #ff6b35)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>FIT</span>
        <span style={{ color: '#e8f4ff' }}>FORGE</span>
      </div>

      <div style={{
        fontFamily: 'Orbitron, monospace',
        fontSize: '13px',
        color: '#7a9bb5',
        letterSpacing: '6px',
        marginBottom: '24px'
      }}>
        SMART FITNESS PLANNER
      </div>

      {/* Subtitle */}
      <p style={{
        fontSize: '17px',
        color: '#7a9bb5',
        maxWidth: '480px',
        lineHeight: '1.7',
        marginBottom: '44px'
      }}>
        AI-powered workout & diet plans personalized to your body.
        Track progress. Forge your best self.
      </p>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '64px' }}>
        <button
          onClick={() => navigate('/register')}
          style={{
            background: 'linear-gradient(135deg, #00d4ff, #0099cc)',
            color: '#050810',
            border: 'none',
            borderRadius: '8px',
            padding: '14px 36px',
            fontFamily: 'Orbitron, monospace',
            fontSize: '12px',
            fontWeight: '700',
            letterSpacing: '2px',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(0,212,255,0.3)',
            transition: 'all 0.3s'
          }}
          onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
        >
          GET STARTED
        </button>
        <button
          onClick={() => navigate('/login')}
          style={{
            background: 'transparent',
            color: '#00d4ff',
            border: '1px solid #00d4ff',
            borderRadius: '8px',
            padding: '14px 36px',
            fontFamily: 'Orbitron, monospace',
            fontSize: '12px',
            fontWeight: '700',
            letterSpacing: '2px',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
          onMouseEnter={e => { e.target.style.background = 'rgba(0,212,255,0.1)'; e.target.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.transform = 'translateY(0)'; }}
        >
          LOGIN
        </button>
      </div>

      {/* Feature stats */}
      <div style={{ display: 'flex', gap: '48px' }}>
        {[
          { val: 'BMR',  label: 'SMART CALC',    color: '#00d4ff' },
          { val: 'PPL',  label: 'WORKOUT PLANS', color: '#ff6b35' },
          { val: 'TDEE', label: 'DIET ENGINE',   color: '#00ff88' },
          { val: '📈',   label: 'PROGRESS',      color: '#a855f7' },
        ].map(f => (
          <div key={f.label} style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'Orbitron, monospace',
              fontSize: '24px',
              fontWeight: '900',
              color: f.color
            }}>{f.val}</div>
            <div style={{
              fontSize: '11px',
              color: '#7a9bb5',
              letterSpacing: '2px',
              marginTop: '6px'
            }}>{f.label}</div>
          </div>
        ))}
      </div>

      {/* Bottom tagline */}
      <div style={{
        position: 'absolute', bottom: '32px',
        fontFamily: 'Orbitron, monospace',
        fontSize: '10px',
        color: '#7a9bb5',
        letterSpacing: '3px',
        opacity: 0.5
      }}>
        BUILT WITH SPRING BOOT · REACT · MYSQL
      </div>
    </div>
  );
}