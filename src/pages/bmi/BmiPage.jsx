import { useState } from 'react';

export default function BmiPage() {
  const [form, setForm]     = useState({ weight:'', height:'', age:'', gender:'MALE' });
  const [result, setResult] = useState(null);

  const calculate = (e) => {
    e.preventDefault();
    const w = parseFloat(form.weight);
    const h = parseFloat(form.height) / 100;
    const a = parseInt(form.age);

    const bmi  = w / (h * h);
    const bmiR = Math.round(bmi * 10) / 10;

    // BMR using Mifflin-St Jeor
    let bmr = (10 * w) + (6.25 * (h * 100)) - (5 * a);
    bmr = form.gender === 'MALE' ? bmr + 5 : bmr - 161;

    const category =
      bmi < 18.5 ? 'Underweight' :
      bmi < 25   ? 'Normal'      :
      bmi < 30   ? 'Overweight'  : 'Obese';

    const color =
      bmi < 18.5 ? '#3b82f6' :
      bmi < 25   ? '#00ff88' :
      bmi < 30   ? '#eab308' : '#ff6b35';

    const idealMin = Math.round(18.5 * h * h * 10) / 10;
    const idealMax = Math.round(24.9 * h * h * 10) / 10;

    setResult({ bmi: bmiR, category, color, bmr: Math.round(bmr), idealMin, idealMax });
  };

  const inputStyle = {
    width:'100%', background:'rgba(0,212,255,0.04)',
    border:'1px solid rgba(0,212,255,0.15)', borderRadius:'8px',
    padding:'12px 16px', color:'#e8f4ff',
    fontFamily:'Rajdhani,sans-serif', fontSize:'15px',
    outline:'none', marginTop:'6px'
  };

  // BMI scale marker position
  const markerPct = result
    ? Math.min(Math.max(((result.bmi - 10) / 30) * 100, 0), 100)
    : 0;

  return (
    <div style={{ padding:'32px', background:'#050810', minHeight:'100vh' }}>
      <div style={{ marginBottom:'32px' }}>
        <h1 style={{ fontFamily:'Orbitron,monospace', fontSize:'22px', fontWeight:'900' }}>
          BMI{' '}
          <span style={{ background:'linear-gradient(135deg,#00d4ff,#ff6b35)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            CALCULATOR
          </span>
        </h1>
        <p style={{ color:'#7a9bb5', fontSize:'14px', marginTop:'6px' }}>
          Calculate your Body Mass Index and Basal Metabolic Rate
        </p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px' }}>

        {/* Form */}
        <div style={{ background:'#0d1528', border:'1px solid rgba(0,212,255,0.15)',
          borderRadius:'16px', padding:'28px' }}>
          <div style={{ fontFamily:'Orbitron,monospace', fontSize:'11px',
            color:'#7a9bb5', letterSpacing:'2px', marginBottom:'20px' }}>
            ENTER YOUR DETAILS
          </div>
          <form onSubmit={calculate}>
            <div style={{ marginBottom:'16px' }}>
              <label style={{ fontSize:'11px', color:'#7a9bb5',
                letterSpacing:'2px', display:'block' }}>WEIGHT (KG) *</label>
              <input style={inputStyle} type="number" step="0.1"
                placeholder="e.g. 72" required
                value={form.weight}
                onChange={e => setForm({...form, weight: e.target.value})}/>
            </div>
            <div style={{ marginBottom:'16px' }}>
              <label style={{ fontSize:'11px', color:'#7a9bb5',
                letterSpacing:'2px', display:'block' }}>HEIGHT (CM) *</label>
              <input style={inputStyle} type="number" step="0.1"
                placeholder="e.g. 175" required
                value={form.height}
                onChange={e => setForm({...form, height: e.target.value})}/>
            </div>
            <div style={{ marginBottom:'16px' }}>
              <label style={{ fontSize:'11px', color:'#7a9bb5',
                letterSpacing:'2px', display:'block' }}>AGE *</label>
              <input style={inputStyle} type="number"
                placeholder="e.g. 21" required
                value={form.age}
                onChange={e => setForm({...form, age: e.target.value})}/>
            </div>
            <div style={{ marginBottom:'24px' }}>
              <label style={{ fontSize:'11px', color:'#7a9bb5',
                letterSpacing:'2px', display:'block' }}>GENDER</label>
              <select style={inputStyle} value={form.gender}
                onChange={e => setForm({...form, gender: e.target.value})}>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
            <button type="submit" style={{
              width:'100%', background:'linear-gradient(135deg,#00d4ff,#0099cc)',
              color:'#050810', border:'none', borderRadius:'8px', padding:'13px',
              fontFamily:'Orbitron,monospace', fontSize:'12px',
              fontWeight:'700', letterSpacing:'2px', cursor:'pointer' }}>
              CALCULATE
            </button>
          </form>

          {/* BMI reference table */}
          <div style={{ marginTop:'24px' }}>
            <div style={{ fontFamily:'Orbitron,monospace', fontSize:'10px',
              color:'#7a9bb5', letterSpacing:'2px', marginBottom:'12px' }}>
              BMI REFERENCE
            </div>
            {[
              { range:'Below 18.5', label:'Underweight', color:'#3b82f6' },
              { range:'18.5 – 24.9', label:'Normal',    color:'#00ff88' },
              { range:'25.0 – 29.9', label:'Overweight', color:'#eab308' },
              { range:'30.0+',       label:'Obese',      color:'#ff6b35' },
            ].map(r => (
              <div key={r.label} style={{ display:'flex', justifyContent:'space-between',
                alignItems:'center', padding:'8px 0',
                borderBottom:'1px solid rgba(0,212,255,0.06)' }}>
                <span style={{ fontSize:'13px', color:'#7a9bb5' }}>{r.range}</span>
                <span style={{ fontFamily:'Orbitron,monospace', fontSize:'11px',
                  color:r.color, letterSpacing:'1px' }}>{r.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Result */}
        <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
          {result ? (
            <>
              {/* BMI Score */}
              <div style={{ background:'#0d1528', border:`1px solid ${result.color}33`,
                borderRadius:'16px', padding:'28px', textAlign:'center' }}>
                <div style={{ fontFamily:'Orbitron,monospace', fontSize:'11px',
                  color:'#7a9bb5', letterSpacing:'2px', marginBottom:'16px' }}>
                  YOUR BMI SCORE
                </div>
                <div style={{ fontFamily:'Orbitron,monospace', fontSize:'64px',
                  fontWeight:'900', color:result.color,
                  textShadow:`0 0 30px ${result.color}66`,
                  lineHeight:'1', marginBottom:'8px' }}>
                  {result.bmi}
                </div>
                <div style={{ fontFamily:'Orbitron,monospace', fontSize:'14px',
                  color:result.color, letterSpacing:'3px' }}>
                  {result.category.toUpperCase()}
                </div>

                {/* BMI Scale */}
                <div style={{ margin:'24px 0 8px', position:'relative' }}>
                  <div style={{ height:'10px', borderRadius:'5px',
                    background:'linear-gradient(90deg,#3b82f6,#00ff88,#eab308,#ff6b35)',
                    position:'relative' }}>
                    <div style={{
                      position:'absolute', top:'-5px',
                      left:`${markerPct}%`,
                      transform:'translateX(-50%)',
                      width:'20px', height:'20px',
                      background:'white',
                      border:`3px solid ${result.color}`,
                      borderRadius:'50%',
                      transition:'left 0.5s ease'
                    }}/>
                  </div>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between',
                  fontSize:'10px', color:'#7a9bb5', marginTop:'8px' }}>
                  <span>10</span><span>18.5</span>
                  <span>25</span><span>30</span><span>40</span>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
                {[
                  { label:'BMR',         val:`${result.bmr} kcal`, color:'#00d4ff',
                    sub:'Calories at rest' },
                  { label:'IDEAL RANGE', val:`${result.idealMin}–${result.idealMax}kg`,
                    color:'#00ff88', sub:'For your height' },
                ].map(s => (
                  <div key={s.label} style={{ background:'#0d1528',
                    border:`1px solid ${s.color}22`,
                    borderRadius:'12px', padding:'20px', textAlign:'center' }}>
                    <div style={{ fontSize:'11px', color:'#7a9bb5',
                      letterSpacing:'2px', marginBottom:'8px' }}>{s.label}</div>
                    <div style={{ fontFamily:'Orbitron,monospace', fontSize:'16px',
                      fontWeight:'700', color:s.color, marginBottom:'4px' }}>
                      {s.val}
                    </div>
                    <div style={{ fontSize:'11px', color:'#7a9bb5' }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Suggestion */}
              <div style={{ background:'rgba(0,212,255,0.04)',
                border:'1px solid rgba(0,212,255,0.15)',
                borderRadius:'12px', padding:'20px' }}>
                <div style={{ fontFamily:'Orbitron,monospace', fontSize:'10px',
                  color:'#00d4ff', letterSpacing:'2px', marginBottom:'10px' }}>
                  AI SUGGESTION
                </div>
                <div style={{ fontSize:'13px', color:'#7a9bb5', lineHeight:'1.8' }}>
                  {result.category === 'Underweight' &&
                    '🔵 You are underweight. Consider a BULK goal with a 300-500 kcal surplus. Focus on protein-rich foods and strength training.'}
                  {result.category === 'Normal' &&
                    '🟢 Great BMI! Consider a MAINTAIN or BULK goal. Keep up your current routine and track progress weekly.'}
                  {result.category === 'Overweight' &&
                    '🟡 Consider a CUT goal with a 500 kcal deficit. Add 3-4 cardio sessions per week alongside strength training.'}
                  {result.category === 'Obese' &&
                    '🔴 A CUT goal is recommended. Start with low-impact cardio, focus on nutrition, and aim for 0.5-1kg loss per week.'}
                </div>
              </div>
            </>
          ) : (
            <div style={{ background:'#0d1528', border:'1px solid rgba(0,212,255,0.15)',
              borderRadius:'16px', padding:'60px 28px', textAlign:'center' }}>
              <div style={{ fontFamily:'Orbitron,monospace', fontSize:'48px',
                marginBottom:'16px', opacity:0.3 }}>⚡</div>
              <div style={{ fontFamily:'Orbitron,monospace', fontSize:'13px',
                color:'#7a9bb5', letterSpacing:'2px' }}>
                ENTER YOUR DETAILS TO CALCULATE
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}