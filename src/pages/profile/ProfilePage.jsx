import { useState, useEffect } from 'react';
import { saveProfile, getProfile } from '../../api/userApi';

export default function ProfilePage() {
  const [form, setForm] = useState({
    age: '', gender: 'MALE', heightCm: '', weightKg: '', activityLevel: 'MODERATELY_ACTIVE'
  });
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getProfile().then(r => {
      const d = r.data;
      setForm({ age: d.age, gender: d.gender,
        heightCm: d.heightCm, weightKg: d.weightKg, activityLevel: d.activityLevel });
      setResult(d);
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const r = await saveProfile(form);
      setResult(r.data);
      setMsg('Profile saved!');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error saving profile');
    }
  };

  const inputStyle = { width:'100%', background:'rgba(0,212,255,0.04)',
    border:'1px solid rgba(0,212,255,0.15)', borderRadius:'8px', padding:'12px 16px',
    color:'#e8f4ff', fontFamily:'Rajdhani,sans-serif', fontSize:'15px', outline:'none',
    marginTop:'6px' };

  const labelStyle = { fontSize:'11px', color:'#7a9bb5', letterSpacing:'2px', display:'block' };

  return (
    <div style={{ padding:'32px', background:'var(--bg)', minHeight:'100vh' }}>
      <div style={{ marginBottom:'32px' }}>
        <h1 style={{ fontFamily:'Orbitron,monospace', fontSize:'22px', fontWeight:'900' }}>
          FITNESS <span style={{ background:'linear-gradient(135deg,#00d4ff,#ff6b35)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>PROFILE</span>
        </h1>
        <p style={{ color:'#7a9bb5', fontSize:'14px', marginTop:'6px' }}>
          Your metrics power the plan engine
        </p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px' }}>
        <div style={{ background:'#0d1528', border:'1px solid rgba(0,212,255,0.15)',
          borderRadius:'16px', padding:'28px' }}>
          {msg && <div style={{ marginBottom:'16px', padding:'12px', borderRadius:'8px',
            background:'rgba(0,255,136,0.08)', border:'1px solid rgba(0,255,136,0.2)',
            color:'#00ff88', fontSize:'13px' }}>{msg}</div>}
          <form onSubmit={handleSubmit}>
            {[
              { label:'AGE', key:'age', type:'number', placeholder:'21' },
              { label:'HEIGHT (CM)', key:'heightCm', type:'number', placeholder:'175' },
              { label:'WEIGHT (KG)', key:'weightKg', type:'number', placeholder:'72' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom:'16px' }}>
                <label style={labelStyle}>{f.label}</label>
                <input style={inputStyle} type={f.type} placeholder={f.placeholder}
                  value={form[f.key]} onChange={e => setForm({...form,[f.key]:e.target.value})} required/>
              </div>
            ))}
            <div style={{ marginBottom:'16px' }}>
              <label style={labelStyle}>GENDER</label>
              <select style={inputStyle} value={form.gender}
                onChange={e => setForm({...form, gender:e.target.value})}>
                <option>MALE</option><option>FEMALE</option><option>OTHER</option>
              </select>
            </div>
            <div style={{ marginBottom:'24px' }}>
              <label style={labelStyle}>ACTIVITY LEVEL</label>
              <select style={inputStyle} value={form.activityLevel}
                onChange={e => setForm({...form, activityLevel:e.target.value})}>
                <option value="SEDENTARY">Sedentary</option>
                <option value="LIGHTLY_ACTIVE">Lightly Active</option>
                <option value="MODERATELY_ACTIVE">Moderately Active</option>
                <option value="VERY_ACTIVE">Very Active</option>
                <option value="EXTRA_ACTIVE">Extra Active</option>
              </select>
            </div>
            <button type="submit" style={{ width:'100%', background:'linear-gradient(135deg,#00d4ff,#0099cc)',
              color:'#050810', border:'none', borderRadius:'8px', padding:'13px',
              fontFamily:'Orbitron,monospace', fontSize:'12px', fontWeight:'700',
              letterSpacing:'2px', cursor:'pointer' }}>SAVE PROFILE</button>
          </form>
        </div>

        {result && (
          <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
            <div style={{ background:'#0d1528', border:'1px solid rgba(0,212,255,0.15)',
              borderRadius:'16px', padding:'28px', textAlign:'center' }}>
              <div style={{ fontSize:'11px', color:'#7a9bb5', letterSpacing:'2px', marginBottom:'16px' }}>
                BMI SCORE
              </div>
              <div style={{ fontFamily:'Orbitron,monospace', fontSize:'52px', fontWeight:'900',
                color:'#00ff88', textShadow:'0 0 20px rgba(0,255,136,0.5)' }}>{result.bmi}</div>
              <div style={{ fontFamily:'Orbitron,monospace', fontSize:'12px', color:'#00ff88',
                letterSpacing:'3px', marginTop:'8px' }}>{result.bmiCategory?.toUpperCase()}</div>
            </div>
            <div style={{ background:'#0d1528', border:'1px solid rgba(0,212,255,0.15)',
              borderRadius:'16px', padding:'28px' }}>
              <div style={{ fontSize:'11px', color:'#7a9bb5', letterSpacing:'2px', marginBottom:'16px' }}>
                PROFILE SAVED
              </div>
              {[
                ['Age', result.age + ' years'],
                ['Height', result.heightCm + ' cm'],
                ['Weight', result.weightKg + ' kg'],
                ['Gender', result.gender],
                ['Activity', result.activityLevel],
              ].map(([k,v]) => (
                <div key={k} style={{ display:'flex', justifyContent:'space-between',
                  padding:'10px 0', borderBottom:'1px solid rgba(0,212,255,0.06)' }}>
                  <span style={{ color:'#7a9bb5', fontSize:'13px' }}>{k}</span>
                  <span style={{ fontFamily:'Orbitron,monospace', fontSize:'12px', color:'#00d4ff' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}