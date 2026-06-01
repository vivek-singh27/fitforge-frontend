import { useState } from 'react';
import { setGoal } from '../../api/goalApi';
import { useNavigate } from 'react-router-dom';

export default function GoalPage() {
  const [selected, setSelected] = useState('BULK');
  const [weeks, setWeeks] = useState(12);
  const [targetWeight, setTargetWeight] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setGoal({ goalType: selected, durationWeeks: parseInt(weeks),
        targetWeightKg: targetWeight || null });
      setMsg('Goal set! Redirecting to plans...');
      setTimeout(() => navigate('/plans'), 1500);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error setting goal');
    }
  };

  const goals = [
    { type:'CUT',      icon:'🔥', color:'#00d4ff', desc:'Lose fat, preserve muscle. 500 kcal deficit.' },
    { type:'BULK',     icon:'💪', color:'#ff6b35', desc:'Build muscle with clean surplus of 300 kcal.' },
    { type:'MAINTAIN', icon:'⚖️', color:'#00ff88', desc:'Stay at current weight, match your TDEE.' },
  ];

  return (
    <div style={{ padding:'32px', background:'var(--bg)', minHeight:'100vh' }}>
      <div style={{ marginBottom:'32px' }}>
        <h1 style={{ fontFamily:'Orbitron,monospace', fontSize:'22px', fontWeight:'900' }}>
          SET YOUR <span style={{ background:'linear-gradient(135deg,#00d4ff,#ff6b35)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>GOAL</span>
        </h1>
        <p style={{ color:'#7a9bb5', fontSize:'14px', marginTop:'6px' }}>
          Choose your objective — your plan generates instantly
        </p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px', marginBottom:'28px' }}>
        {goals.map(g => (
          <div key={g.type} onClick={() => setSelected(g.type)}
            style={{ background:'#0d1528', border:`2px solid ${selected===g.type ? g.color : 'rgba(0,212,255,0.1)'}`,
              borderRadius:'16px', padding:'28px', cursor:'pointer', textAlign:'center',
              transition:'all 0.3s', boxShadow: selected===g.type ? `0 0 24px ${g.color}22` : 'none' }}>
            <div style={{ fontSize:'32px', marginBottom:'12px' }}>{g.icon}</div>
            <div style={{ fontFamily:'Orbitron,monospace', fontSize:'14px', fontWeight:'700',
              letterSpacing:'2px', color:g.color, marginBottom:'10px' }}>{g.type}</div>
            <div style={{ fontSize:'12px', color:'#7a9bb5', lineHeight:'1.6' }}>{g.desc}</div>
            {selected===g.type && (
              <div style={{ marginTop:'12px', background:g.color, color:'#050810',
                fontFamily:'Orbitron,monospace', fontSize:'9px', fontWeight:'700',
                padding:'4px 12px', borderRadius:'4px', letterSpacing:'1px', display:'inline-block' }}>
                SELECTED
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ background:'#0d1528', border:'1px solid rgba(0,212,255,0.15)',
        borderRadius:'16px', padding:'28px', maxWidth:'480px' }}>
        {msg && <div style={{ marginBottom:'16px', padding:'12px', borderRadius:'8px',
          background:'rgba(0,255,136,0.08)', color:'#00ff88', fontSize:'13px',
          border:'1px solid rgba(0,255,136,0.2)' }}>{msg}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:'16px' }}>
            <label style={{ fontSize:'11px', color:'#7a9bb5', letterSpacing:'2px', display:'block', marginBottom:'8px' }}>
              DURATION (WEEKS)
            </label>
            <select value={weeks} onChange={e => setWeeks(e.target.value)}
              style={{ width:'100%', background:'rgba(0,212,255,0.04)', border:'1px solid rgba(0,212,255,0.15)',
                borderRadius:'8px', padding:'12px 16px', color:'#e8f4ff',
                fontFamily:'Rajdhani,sans-serif', fontSize:'15px', outline:'none' }}>
              {[4,8,12,16,24].map(w => <option key={w} value={w}>{w} weeks</option>)}
            </select>
          </div>
          <div style={{ marginBottom:'24px' }}>
            <label style={{ fontSize:'11px', color:'#7a9bb5', letterSpacing:'2px', display:'block', marginBottom:'8px' }}>
              TARGET WEIGHT KG (OPTIONAL)
            </label>
            <input type="number" value={targetWeight} onChange={e => setTargetWeight(e.target.value)}
              placeholder="e.g. 68"
              style={{ width:'100%', background:'rgba(0,212,255,0.04)', border:'1px solid rgba(0,212,255,0.15)',
                borderRadius:'8px', padding:'12px 16px', color:'#e8f4ff',
                fontFamily:'Rajdhani,sans-serif', fontSize:'15px', outline:'none' }}/>
          </div>
          <button type="submit" style={{ width:'100%', background:'linear-gradient(135deg,#00d4ff,#0099cc)',
            color:'#050810', border:'none', borderRadius:'8px', padding:'13px',
            fontFamily:'Orbitron,monospace', fontSize:'12px', fontWeight:'700',
            letterSpacing:'2px', cursor:'pointer' }}>GENERATE MY PLAN</button>
        </form>
      </div>
    </div>
  );
}