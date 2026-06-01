import { useEffect, useState } from 'react';
import { logMeal, getTodayCalories, deleteMeal } from '../../api/trackingApi';

export default function CalorieTrackerPage() {
  const [summary, setSummary] = useState(null);
  const [form, setForm]       = useState({
    mealName:'', calories:'', proteinGrams:'', carbsGrams:'', fatGrams:''
  });
  const [msg, setMsg]   = useState('');
  const [loading, setLoading] = useState(true);

  const fetchSummary = () =>
    getTodayCalories()
      .then(r => setSummary(r.data))
      .catch(() => setSummary(null))
      .finally(() => setLoading(false));

  useEffect(() => { fetchSummary(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await logMeal({
        mealName:     form.mealName,
        calories:     parseInt(form.calories),
        proteinGrams: form.proteinGrams ? parseFloat(form.proteinGrams) : null,
        carbsGrams:   form.carbsGrams   ? parseFloat(form.carbsGrams)   : null,
        fatGrams:     form.fatGrams     ? parseFloat(form.fatGrams)     : null,
      });
      setMsg('✓ Meal logged!');
      setForm({ mealName:'', calories:'', proteinGrams:'', carbsGrams:'', fatGrams:'' });
      fetchSummary();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error logging meal');
    }
    setTimeout(() => setMsg(''), 3000);
  };

  const handleDelete = async (id) => {
    await deleteMeal(id);
    fetchSummary();
  };

  const inputStyle = {
    width:'100%', background:'rgba(0,212,255,0.04)',
    border:'1px solid rgba(0,212,255,0.15)', borderRadius:'8px',
    padding:'11px 14px', color:'#e8f4ff',
    fontFamily:'Rajdhani,sans-serif', fontSize:'14px', outline:'none', marginTop:'6px'
  };

  // Calorie ring SVG
  const CalRing = ({ consumed, target }) => {
    const r    = 70, sw = 12;
    const circ = 2 * Math.PI * r;
    const pct  = Math.min((consumed / target) * 100, 100);
    const dash = (pct / 100) * circ;
    const color = pct >= 100 ? '#ff6b35' : pct >= 80 ? '#eab308' : '#00d4ff';
    return (
      <svg width="180" height="180" viewBox="0 0 180 180"
        style={{ display:'block', margin:'0 auto' }}>
        <circle cx="90" cy="90" r={r} fill="none"
          stroke="rgba(255,255,255,0.05)" strokeWidth={sw}/>
        <circle cx="90" cy="90" r={r} fill="none"
          stroke={color} strokeWidth={sw}
          strokeDasharray={`${dash.toFixed(1)} ${circ.toFixed(1)}`}
          strokeLinecap="round" transform="rotate(-90 90 90)"/>
        <text x="90" y="82" textAnchor="middle" fill={color}
          fontFamily="Orbitron,monospace" fontSize="22" fontWeight="700">
          {consumed}
        </text>
        <text x="90" y="100" textAnchor="middle" fill="#7a9bb5"
          fontFamily="Rajdhani,sans-serif" fontSize="13">
          of {target} kcal
        </text>
        <text x="90" y="118" textAnchor="middle"
          fill={pct >= 100 ? '#ff6b35' : '#00ff88'}
          fontFamily="Orbitron,monospace" fontSize="11">
          {pct >= 100 ? 'LIMIT REACHED' : `${target - consumed} LEFT`}
        </text>
      </svg>
    );
  };

  return (
    <div style={{ padding:'32px', background:'#050810', minHeight:'100vh' }}>
      <div style={{ marginBottom:'32px' }}>
        <h1 style={{ fontFamily:'Orbitron,monospace', fontSize:'22px', fontWeight:'900' }}>
          CALORIE{' '}
          <span style={{ background:'linear-gradient(135deg,#00d4ff,#ff6b35)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            TRACKER
          </span>
        </h1>
        <p style={{ color:'#7a9bb5', fontSize:'14px', marginTop:'6px' }}>
          {new Date().toLocaleDateString('en-IN',
            { weekday:'long', day:'numeric', month:'long' })}
        </p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px' }}>

        {/* Left — ring + macros */}
        <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
          <div style={{ background:'#0d1528', border:'1px solid rgba(0,212,255,0.15)',
            borderRadius:'16px', padding:'28px', textAlign:'center' }}>
            <div style={{ fontFamily:'Orbitron,monospace', fontSize:'11px',
              color:'#7a9bb5', letterSpacing:'2px', marginBottom:'20px' }}>
              TODAY'S CALORIES
            </div>
            {summary ? (
              <CalRing
                consumed={summary.totalCaloriesToday}
                target={summary.targetCalories}/>
            ) : (
              <div style={{ height:'180px', display:'flex', alignItems:'center',
                justifyContent:'center', color:'#7a9bb5' }}>Loading...</div>
            )}
          </div>

          {/* Macro bars */}
          {summary && (
            <div style={{ background:'#0d1528', border:'1px solid rgba(0,212,255,0.15)',
              borderRadius:'16px', padding:'24px' }}>
              <div style={{ fontFamily:'Orbitron,monospace', fontSize:'11px',
                color:'#7a9bb5', letterSpacing:'2px', marginBottom:'16px' }}>
                MACROS TODAY
              </div>
              {[
                { label:'Protein', val:summary.totalProteinToday, color:'#00d4ff', unit:'g' },
                { label:'Carbs',   val:summary.totalCarbsToday,   color:'#ff6b35', unit:'g' },
                { label:'Fat',     val:summary.totalFatToday,     color:'#00ff88', unit:'g' },
              ].map(m => (
                <div key={m.label} style={{ marginBottom:'14px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between',
                    marginBottom:'6px' }}>
                    <span style={{ fontSize:'13px', color:'#7a9bb5' }}>{m.label}</span>
                    <span style={{ fontFamily:'Orbitron,monospace',
                      fontSize:'12px', color:m.color }}>
                      {m.val}{m.unit}
                    </span>
                  </div>
                  <div style={{ height:'5px', background:'rgba(255,255,255,0.05)',
                    borderRadius:'3px' }}>
                    <div style={{ height:'100%', width:`${Math.min(m.val * 2, 100)}%`,
                      background:`linear-gradient(90deg,${m.color},${m.color}88)`,
                      borderRadius:'3px', transition:'width 0.8s ease' }}/>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right — log form + meal list */}
        <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
          <div style={{ background:'#0d1528', border:'1px solid rgba(0,212,255,0.15)',
            borderRadius:'16px', padding:'24px' }}>
            <div style={{ fontFamily:'Orbitron,monospace', fontSize:'11px',
              color:'#7a9bb5', letterSpacing:'2px', marginBottom:'16px' }}>
              LOG A MEAL
            </div>

            {msg && (
              <div style={{ marginBottom:'14px', padding:'10px 14px', borderRadius:'8px',
                background: msg.startsWith('✓') ? 'rgba(0,255,136,0.08)' : 'rgba(255,107,53,0.08)',
                border:`1px solid ${msg.startsWith('✓') ? 'rgba(0,255,136,0.25)' : 'rgba(255,107,53,0.25)'}`,
                color: msg.startsWith('✓') ? '#00ff88' : '#ff6b35',
                fontSize:'12px', letterSpacing:'1px' }}>
                {msg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={{ fontSize:'11px', color:'#7a9bb5',
                    letterSpacing:'2px', display:'block' }}>MEAL NAME *</label>
                  <input style={inputStyle} placeholder="e.g. Breakfast"
                    value={form.mealName} required
                    onChange={e => setForm({...form, mealName: e.target.value})}/>
                </div>
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={{ fontSize:'11px', color:'#7a9bb5',
                    letterSpacing:'2px', display:'block' }}>CALORIES *</label>
                  <input style={inputStyle} type="number" placeholder="e.g. 450"
                    value={form.calories} required
                    onChange={e => setForm({...form, calories: e.target.value})}/>
                </div>
                <div>
                  <label style={{ fontSize:'11px', color:'#7a9bb5',
                    letterSpacing:'2px', display:'block' }}>PROTEIN (g)</label>
                  <input style={inputStyle} type="number" step="0.1" placeholder="0"
                    value={form.proteinGrams}
                    onChange={e => setForm({...form, proteinGrams: e.target.value})}/>
                </div>
                <div>
                  <label style={{ fontSize:'11px', color:'#7a9bb5',
                    letterSpacing:'2px', display:'block' }}>CARBS (g)</label>
                  <input style={inputStyle} type="number" step="0.1" placeholder="0"
                    value={form.carbsGrams}
                    onChange={e => setForm({...form, carbsGrams: e.target.value})}/>
                </div>
                <div>
                  <label style={{ fontSize:'11px', color:'#7a9bb5',
                    letterSpacing:'2px', display:'block' }}>FAT (g)</label>
                  <input style={inputStyle} type="number" step="0.1" placeholder="0"
                    value={form.fatGrams}
                    onChange={e => setForm({...form, fatGrams: e.target.value})}/>
                </div>
              </div>
              <button type="submit" style={{
                width:'100%', marginTop:'16px',
                background:'linear-gradient(135deg,#ff6b35,#cc4400)',
                color:'#fff', border:'none', borderRadius:'8px', padding:'12px',
                fontFamily:'Orbitron,monospace', fontSize:'11px',
                fontWeight:'700', letterSpacing:'2px', cursor:'pointer' }}>
                + LOG MEAL
              </button>
            </form>
          </div>

          {/* Meal list */}
          <div style={{ background:'#0d1528', border:'1px solid rgba(0,212,255,0.15)',
            borderRadius:'16px', padding:'24px' }}>
            <div style={{ fontFamily:'Orbitron,monospace', fontSize:'11px',
              color:'#7a9bb5', letterSpacing:'2px', marginBottom:'16px' }}>
              TODAY'S MEALS
            </div>
            {summary?.meals?.length > 0 ? (
              <div style={{ maxHeight:'260px', overflowY:'auto' }}>
                {summary.meals.map(meal => (
                  <div key={meal.id} style={{
                    display:'flex', justifyContent:'space-between',
                    alignItems:'center', padding:'12px',
                    background:'rgba(0,212,255,0.03)',
                    border:'1px solid rgba(0,212,255,0.08)',
                    borderRadius:'8px', marginBottom:'8px' }}>
                    <div>
                      <div style={{ fontFamily:'Orbitron,monospace',
                        fontSize:'11px', color:'#00d4ff',
                        letterSpacing:'1px' }}>{meal.mealName}</div>
                      <div style={{ fontSize:'12px', color:'#7a9bb5', marginTop:'4px' }}>
                        {meal.proteinGrams && `P: ${meal.proteinGrams}g `}
                        {meal.carbsGrams   && `C: ${meal.carbsGrams}g `}
                        {meal.fatGrams     && `F: ${meal.fatGrams}g`}
                      </div>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                      <span style={{ fontFamily:'Orbitron,monospace',
                        fontSize:'14px', color:'#ff6b35',
                        fontWeight:'700' }}>{meal.calories}</span>
                      <button onClick={() => handleDelete(meal.id)}
                        style={{ background:'rgba(255,107,53,0.1)',
                          border:'1px solid rgba(255,107,53,0.2)',
                          color:'#ff6b35', borderRadius:'6px',
                          padding:'4px 10px', cursor:'pointer',
                          fontSize:'12px' }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign:'center', padding:'24px',
                color:'#7a9bb5', fontSize:'13px' }}>
                No meals logged today yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}