import { useEffect, useState } from 'react';
import { getDietPlan, getWorkoutPlan } from '../../api/planApi';

export default function PlanPage() {
  const [diet, setDiet]       = useState(null);
  const [workout, setWorkout] = useState(null);
  const [tab, setTab]         = useState('workout');
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    Promise.all([getDietPlan(), getWorkoutPlan()])
      .then(([d, w]) => { setDiet(d.data); setWorkout(w.data); })
      .catch(err => setError(err.response?.data?.message || 'Load plans first — set goal & profile'))
      .finally(() => setLoading(false));
  }, []);

  const btnStyle = (active) => ({
    padding:'10px 24px', borderRadius:'6px', cursor:'pointer', border:'1px solid',
    fontFamily:'Orbitron,monospace', fontSize:'11px', fontWeight:'700', letterSpacing:'1px',
    background: active ? 'rgba(0,212,255,0.1)' : 'transparent',
    borderColor: active ? '#00d4ff' : 'rgba(0,212,255,0.15)',
    color: active ? '#00d4ff' : '#7a9bb5', transition:'all 0.2s'
  });

  if (loading) return (
    <div style={{ padding:'32px', color:'#00d4ff', fontFamily:'Orbitron,monospace',
      fontSize:'13px', letterSpacing:'3px' }}>GENERATING PLANS...</div>
  );

  if (error) return (
    <div style={{ padding:'32px' }}>
      <div style={{ background:'rgba(255,107,53,0.1)', border:'1px solid rgba(255,107,53,0.3)',
        borderRadius:'12px', padding:'24px', color:'#ff6b35', fontFamily:'Orbitron,monospace',
        fontSize:'13px', letterSpacing:'1px' }}>⚠ {error}</div>
      <a href="/profile" style={{ display:'inline-block', marginTop:'16px', color:'#00d4ff',
        fontFamily:'Orbitron,monospace', fontSize:'12px' }}>→ Complete Profile First</a>
    </div>
  );

  return (
    <div style={{ padding:'32px', background:'var(--bg)', minHeight:'100vh' }}>
      <div style={{ marginBottom:'28px' }}>
        <h1 style={{ fontFamily:'Orbitron,monospace', fontSize:'22px', fontWeight:'900' }}>
          YOUR <span style={{ background:'linear-gradient(135deg,#00d4ff,#ff6b35)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>PLANS</span>
        </h1>
      </div>

      <div style={{ display:'flex', gap:'10px', marginBottom:'28px' }}>
        <button style={btnStyle(tab==='workout')} onClick={() => setTab('workout')}>WORKOUT PLAN</button>
        <button style={btnStyle(tab==='diet')}    onClick={() => setTab('diet')}>DIET PLAN</button>
      </div>

      {tab === 'workout' && workout && (
        <div>
          <div style={{ marginBottom:'20px' }}>
            <div style={{ fontFamily:'Orbitron,monospace', fontSize:'14px', color:'#00d4ff',
              letterSpacing:'2px' }}>{workout.planName}</div>
            <div style={{ fontSize:'13px', color:'#7a9bb5', marginTop:'4px' }}>
              {workout.daysPerWeek} days/week · {workout.planType}
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'20px' }}>
            {Object.entries(workout.weeklyPlan).map(([day, exercises]) => (
              <div key={day} style={{ background:'#0d1528', border:'1px solid rgba(0,212,255,0.15)',
                borderRadius:'16px', padding:'24px' }}>
                <div style={{ fontFamily:'Orbitron,monospace', fontSize:'11px', color:'#00d4ff',
                  letterSpacing:'2px', marginBottom:'16px', paddingBottom:'10px',
                  borderBottom:'1px solid rgba(0,212,255,0.1)' }}>{day}</div>
                {exercises.map((ex, i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
                    padding:'10px 0', borderBottom:'1px solid rgba(0,212,255,0.05)' }}>
                    <div>
                      <div style={{ fontSize:'14px', fontWeight:'600' }}>{ex.exerciseName}</div>
                      <div style={{ fontSize:'11px', color:'#7a9bb5', marginTop:'2px' }}>{ex.muscleGroup}</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontFamily:'Orbitron,monospace', fontSize:'12px', color:'#00d4ff' }}>
                        {ex.sets} × {ex.reps}
                      </div>
                      <div style={{ fontSize:'11px', color:'#7a9bb5' }}>{ex.restSeconds}s rest</div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'diet' && diet && (
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'24px' }}>
            {[
              { label:'CALORIES', val: diet.dailyCalories + ' kcal', color:'#ff6b35' },
              { label:'PROTEIN',  val: diet.proteinGrams + 'g',       color:'#00d4ff' },
              { label:'CARBS',    val: diet.carbsGrams + 'g',         color:'#00ff88' },
              { label:'FAT',      val: diet.fatGrams + 'g',           color:'#a855f7' },
            ].map(s => (
              <div key={s.label} style={{ background:'#0d1528', border:'1px solid rgba(0,212,255,0.15)',
                borderRadius:'12px', padding:'20px' }}>
                <div style={{ fontSize:'11px', color:'#7a9bb5', letterSpacing:'2px' }}>{s.label}</div>
                <div style={{ fontFamily:'Orbitron,monospace', fontSize:'22px', fontWeight:'700',
                  color:s.color, marginTop:'8px' }}>{s.val}</div>
              </div>
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>
            <div style={{ background:'#0d1528', border:'1px solid rgba(0,212,255,0.15)',
              borderRadius:'16px', padding:'24px' }}>
              <div style={{ fontFamily:'Orbitron,monospace', fontSize:'11px', color:'#7a9bb5',
                letterSpacing:'2px', marginBottom:'16px' }}>MEAL PLAN</div>
              {diet.mealSuggestions?.map((m, i) => (
                <div key={i} style={{ background:'rgba(0,212,255,0.04)', border:'1px solid rgba(0,212,255,0.1)',
                  borderRadius:'10px', padding:'14px', marginBottom:'10px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
                    <span style={{ fontFamily:'Orbitron,monospace', fontSize:'11px', color:'#00d4ff' }}>
                      {m.mealName}
                    </span>
                    <span style={{ fontFamily:'Orbitron,monospace', fontSize:'13px', color:'#ff6b35' }}>
                      {m.calories} kcal
                    </span>
                  </div>
                  <div style={{ fontSize:'13px', color:'#7a9bb5' }}>{m.suggestion}</div>
                </div>
              ))}
            </div>
            <div style={{ background:'#0d1528', border:'1px solid rgba(0,212,255,0.15)',
              borderRadius:'16px', padding:'24px' }}>
              <div style={{ fontFamily:'Orbitron,monospace', fontSize:'11px', color:'#7a9bb5',
                letterSpacing:'2px', marginBottom:'16px' }}>DIET NOTES</div>
              <div style={{ fontSize:'13px', color:'#7a9bb5', lineHeight:'1.8' }}>{diet.notes}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}