import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight:'100vh', background:'#050810',
      display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      textAlign:'center', padding:'32px' }}>

      {/* Animated 404 */}
      <div style={{ fontFamily:'Orbitron,monospace', fontSize:'120px',
        fontWeight:'900', lineHeight:'1',
        background:'linear-gradient(135deg,#00d4ff,#ff6b35)',
        WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
        marginBottom:'8px', opacity:0.8 }}>
        404
      </div>

      <div style={{ fontFamily:'Orbitron,monospace', fontSize:'16px',
        color:'#7a9bb5', letterSpacing:'4px', marginBottom:'16px' }}>
        PAGE NOT FOUND
      </div>

      <p style={{ fontSize:'14px', color:'#7a9bb5',
        maxWidth:'360px', lineHeight:'1.7', marginBottom:'32px' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>

      <div style={{ display:'flex', gap:'12px' }}>
        <button onClick={() => navigate('/dashboard')}
          style={{ background:'linear-gradient(135deg,#00d4ff,#0099cc)',
            color:'#050810', border:'none', borderRadius:'8px',
            padding:'12px 28px', fontFamily:'Orbitron,monospace',
            fontSize:'11px', fontWeight:'700', letterSpacing:'2px',
            cursor:'pointer' }}>
          DASHBOARD
        </button>
        <button onClick={() => navigate(-1)}
          style={{ background:'transparent', border:'1px solid #00d4ff',
            color:'#00d4ff', borderRadius:'8px', padding:'12px 28px',
            fontFamily:'Orbitron,monospace', fontSize:'11px',
            fontWeight:'700', letterSpacing:'2px', cursor:'pointer' }}>
          GO BACK
        </button>
      </div>
    </div>
  );
}