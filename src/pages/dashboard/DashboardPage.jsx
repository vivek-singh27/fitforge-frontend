import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProfile } from '../../api/userApi';
import { getActiveGoal } from '../../api/goalApi';
import { getDietPlan, getWorkoutPlan } from '../../api/planApi';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile]   = useState(null);
  const [goal, setGoal]         = useState(null);
  const [diet, setDiet]         = useState(null);
  const [workout, setWorkout]   = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.allSettled([
      getProfile(),
      getActiveGoal(),
      getDietPlan(),
      getWorkoutPlan(),
    ]).then(([p, g, d, w]) => {
      if (p.status === 'fulfilled') setProfile(p.value.data);
      if (g.status === 'fulfilled') setGoal(g.value.data);
      if (d.status === 'fulfilled') setDiet(d.value.data);
      if (w.status === 'fulfilled') setWorkout(w.value.data);
    }).finally(() => setLoading(false));
  }, []);

  // card style helper
  const statCard = (label, value, sub, color) => (
    <div style={{ background:'#0d1528', border:`1px solid ${color}22`,
      borderRadius:'12px', padding:'20px', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:0, right:0, width:'60px', height:'60px',
        borderRadius:'0 12px 0 60px', background:color, opacity:0.08 }}/>
      <div style={{ fontSize:'11px', color:'#7a9bb5', letterSpacing:'2px',
        textTransform:'uppercase', marginBottom:'8px' }}>{label}</div>
      <div style={{ fontFamily:'Orbitron,monospace', fontSize:'26px',
        fontWeight:'700', color:color, marginBottom:'4px' }}>{value}</div>
      <div style={{ fontSize:'12px', color:'#7a9bb5' }}>{sub}</div>
    </div>
  );

  const progBar = (label, current, target, unit, color) => {
    const pct = target ? Math.min(Math.round((current/target)*100), 100) : 0;
    return (
      <div style={{ marginBottom:'16px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
          <span style={{ fontSize:'13px', color:'#7a9bb5' }}>{label}</span>
          <span style={{ fontFamily:'Orbitron,monospace', fontSize:'12px', color }}>
            {current}{unit} / {target}{unit}
          </span>
        </div>
        <div style={{ height:'6px', background:'rgba(255,255,255,0.06)', borderRadius:'3px' }}>
          <div style={{ height:'100%', width:`${pct}%`, borderRadius:'3px',
            background:`linear-gradient(90deg,${color},${color}88)`,
            transition:'width 1s ease' }}/>
        </div>
      </div>
    );
  };


  
  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
      height:'100vh', background:'#050810', color:'#00d4ff',
      fontFamily:'Orbitron,monospace', fontSize:'13px', letterSpacing:'3px' }}>
      LOADING YOUR DATA...
    </div>
  );

  // Setup checklist for new users
  const setupDone = profile && goal;

  return (
    <div style={{ padding:'32px', background:'#050810', minHeight:'100vh' }}>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between',
        alignItems:'flex-start', marginBottom:'32px' }}>
        <div>
          <h1 style={{ fontFamily:'Orbitron,monospace', fontSize:'22px', fontWeight:'900' }}>
            WELCOME BACK,{' '}
            <span style={{ background:'linear-gradient(135deg,#00d4ff,#ff6b35)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              {user?.username?.toUpperCase()}
            </span>
          </h1>
          <p style={{ color:'#7a9bb5', fontSize:'14px', marginTop:'6px', letterSpacing:'1px' }}>
            {goal
              ? `${goal.goalType} Program · ${goal.daysRemaining} days remaining · ${goal.durationWeeks} week plan`
              : 'Complete your setup to generate a personalized plan'}
          </p>
        </div>
        <button onClick={logout}
          style={{ background:'transparent', border:'1px solid rgba(255,107,53,0.4)',
            color:'#ff6b35', borderRadius:'8px', padding:'10px 20px',
            fontFamily:'Orbitron,monospace', fontSize:'11px',
            letterSpacing:'2px', cursor:'pointer' }}>
          LOGOUT
        </button>
      </div>

      {/* Setup banner — shown only if profile or goal missing */}
      {!setupDone && (
        <div style={{ background:'rgba(255,107,53,0.06)',
          border:'1px solid rgba(255,107,53,0.25)', borderRadius:'12px',
          padding:'20px 24px', marginBottom:'28px',
          display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontFamily:'Orbitron,monospace', fontSize:'12px',
              color:'#ff6b35', letterSpacing:'2px', marginBottom:'6px' }}>
              SETUP REQUIRED
            </div>
            <div style={{ fontSize:'13px', color:'#7a9bb5' }}>
              {!profile && '→ Complete your fitness profile   '}
              {!goal    && '→ Set your fitness goal'}
            </div>
          </div>
          <div style={{ display:'flex', gap:'12px' }}>
            {!profile && (
              <button onClick={() => navigate('/profile')}
                style={{ background:'linear-gradient(135deg,#00d4ff,#0099cc)',
                  color:'#050810', border:'none', borderRadius:'8px',
                  padding:'10px 20px', fontFamily:'Orbitron,monospace',
                  fontSize:'11px', fontWeight:'700', letterSpacing:'1px', cursor:'pointer' }}>
                ADD PROFILE
              </button>
            )}
            {!goal && (
              <button onClick={() => navigate('/goal')}
                style={{ background:'linear-gradient(135deg,#ff6b35,#cc4400)',
                  color:'#050810', border:'none', borderRadius:'8px',
                  padding:'10px 20px', fontFamily:'Orbitron,monospace',
                  fontSize:'11px', fontWeight:'700', letterSpacing:'1px', cursor:'pointer' }}>
                SET GOAL
              </button>
            )}
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)',
        gap:'16px', marginBottom:'24px' }}>
        {statCard('CURRENT WEIGHT',
          profile ? `${profile.weightKg}kg` : '--',
          'From your profile', '#00d4ff')}
        {statCard('BMI',
          profile ? profile.bmi : '--',
          profile ? profile.bmiCategory : 'Update profile', '#00ff88')}
        {statCard('DAILY CALORIES',
          diet ? `${diet.dailyCalories}` : '--',
          diet ? `${diet.proteinGrams}g protein` : 'Generate plan', '#ff6b35')}
        {statCard('DAYS LEFT',
          goal ? goal.daysRemaining : '--',
          goal ? `${goal.goalType} · ${goal.durationWeeks}wk` : 'Set a goal', '#a855f7')}
      </div>

      {/* Main grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px' }}>

        {/* Macro progress */}
        <div style={{ background:'#0d1528', border:'1px solid rgba(0,212,255,0.15)',
          borderRadius:'16px', padding:'24px' }}>
          <div style={{ fontFamily:'Orbitron,monospace', fontSize:'11px',
            color:'#7a9bb5', letterSpacing:'2px', marginBottom:'20px' }}>
            DAILY MACRO TARGETS
          </div>
          {diet ? (
            <>
              {progBar('Protein', diet.proteinGrams, diet.proteinGrams, 'g', '#00d4ff')}
              {progBar('Carbs',   diet.carbsGrams,   diet.carbsGrams,   'g', '#ff6b35')}
              {progBar('Fat',     diet.fatGrams,      diet.fatGrams,     'g', '#00ff88')}
              {progBar('Calories',diet.dailyCalories, diet.dailyCalories,'kcal','#a855f7')}
            </>
          ) : (
            <div style={{ textAlign:'center', padding:'32px',
              color:'#7a9bb5', fontSize:'13px' }}>
              Generate a diet plan to see your macros
              <br/>
              <button onClick={() => navigate('/goal')}
                style={{ marginTop:'16px', background:'transparent',
                  border:'1px solid #00d4ff', color:'#00d4ff', borderRadius:'8px',
                  padding:'10px 20px', fontFamily:'Orbitron,monospace',
                  fontSize:'11px', cursor:'pointer', letterSpacing:'1px' }}>
                SET GOAL FIRST
              </button>
            </div>
          )}
        </div>

        {/* Today's workout */}
        <div style={{ background:'#0d1528', border:'1px solid rgba(0,212,255,0.15)',
          borderRadius:'16px', padding:'24px' }}>
          <div style={{ fontFamily:'Orbitron,monospace', fontSize:'11px',
            color:'#7a9bb5', letterSpacing:'2px', marginBottom:'20px' }}>
            TODAY'S WORKOUT
          </div>
          {workout ? (() => {
            const days   = Object.entries(workout.weeklyPlan);
            const dayIdx = new Date().getDay();         // 0=Sun,1=Mon,...
            const mapped = [6,0,1,2,3,4,5];            // map to PPL rotation
            const idx    = mapped[dayIdx] % days.length;
            const [dayName, exercises] = days[idx] || days[0];
            return (
              <>
                <div style={{ fontFamily:'Orbitron,monospace', fontSize:'10px',
                  color:'#00d4ff', letterSpacing:'2px', marginBottom:'14px',
                  paddingBottom:'10px', borderBottom:'1px solid rgba(0,212,255,0.1)' }}>
                  {dayName}
                </div>
                {exercises.slice(0,5).map((ex, i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between',
                    alignItems:'center', padding:'10px 0',
                    borderBottom:'1px solid rgba(0,212,255,0.05)' }}>
                    <div>
                      <div style={{ fontSize:'14px', fontWeight:'600' }}>{ex.exerciseName}</div>
                      <div style={{ fontSize:'11px', color:'#7a9bb5', marginTop:'2px' }}>
                        {ex.muscleGroup}
                      </div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontFamily:'Orbitron,monospace',
                        fontSize:'12px', color:'#00d4ff' }}>
                        {ex.sets} × {ex.reps}
                      </div>
                      <div style={{ fontSize:'11px', color:'#7a9bb5' }}>
                        {ex.restSeconds}s rest
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={() => navigate('/plans')}
                  style={{ width:'100%', marginTop:'16px', background:'transparent',
                    border:'1px solid rgba(0,212,255,0.2)', color:'#00d4ff',
                    borderRadius:'8px', padding:'10px', fontFamily:'Orbitron,monospace',
                    fontSize:'11px', cursor:'pointer', letterSpacing:'1px' }}>
                  VIEW FULL PLAN →
                </button>
              </>
            );
          })() : (
            <div style={{ textAlign:'center', padding:'32px',
              color:'#7a9bb5', fontSize:'13px' }}>
              No workout plan yet
              <br/>
              <button onClick={() => navigate('/goal')}
                style={{ marginTop:'16px', background:'transparent',
                  border:'1px solid #00d4ff', color:'#00d4ff',
                  borderRadius:'8px', padding:'10px 20px',
                  fontFamily:'Orbitron,monospace', fontSize:'11px',
                  cursor:'pointer', letterSpacing:'1px' }}>
                GENERATE PLAN
              </button>
            </div>
          )}
        </div>

        {/* Goal progress card */}
        {goal && (
          <div style={{ background:'#0d1528', border:'1px solid rgba(0,212,255,0.15)',
            borderRadius:'16px', padding:'24px' }}>
            <div style={{ fontFamily:'Orbitron,monospace', fontSize:'11px',
              color:'#7a9bb5', letterSpacing:'2px', marginBottom:'20px' }}>
              GOAL PROGRESS
            </div>
            <div style={{ textAlign:'center', marginBottom:'20px' }}>
              {(() => {
                const total   = goal.durationWeeks * 7;
                const elapsed = total - goal.daysRemaining;
                const pct     = Math.round((elapsed / total) * 100);
                const r = 60, circ = 2 * Math.PI * r;
                const dash = (pct / 100) * circ;
                return (
                  <>
                    <svg width="160" height="160" viewBox="0 0 160 160"
                      style={{ display:'block', margin:'0 auto' }}>
                      <circle cx="80" cy="80" r={r} fill="none"
                        stroke="rgba(255,255,255,0.05)" strokeWidth="12"/>
                      <circle cx="80" cy="80" r={r} fill="none"
                        stroke="#ff6b35" strokeWidth="12"
                        strokeDasharray={`${dash.toFixed(1)} ${circ.toFixed(1)}`}
                        strokeLinecap="round"
                        transform="rotate(-90 80 80)"/>
                      <text x="80" y="72" textAnchor="middle"
                        fill="#ff6b35" fontFamily="Orbitron,monospace"
                        fontSize="24" fontWeight="700">{pct}%</text>
                      <text x="80" y="92" textAnchor="middle"
                        fill="#7a9bb5" fontFamily="Rajdhani,sans-serif"
                        fontSize="13">COMPLETE</text>
                    </svg>
                    <div style={{ fontFamily:'Orbitron,monospace', fontSize:'11px',
                      color:'#7a9bb5', letterSpacing:'2px', marginTop:'12px' }}>
                      {elapsed} of {total} days done
                    </div>
                  </>
                );
              })()}
            </div>
            <div style={{ display:'flex', justifyContent:'space-between',
              padding:'12px 0', borderTop:'1px solid rgba(0,212,255,0.1)' }}>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontFamily:'Orbitron,monospace', fontSize:'16px',
                  color:'#00d4ff', fontWeight:'700' }}>{goal.durationWeeks}</div>
                <div style={{ fontSize:'11px', color:'#7a9bb5', marginTop:'4px' }}>WEEKS</div>
              </div>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontFamily:'Orbitron,monospace', fontSize:'16px',
                  color:'#ff6b35', fontWeight:'700' }}>{goal.goalType}</div>
                <div style={{ fontSize:'11px', color:'#7a9bb5', marginTop:'4px' }}>PROGRAM</div>
              </div>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontFamily:'Orbitron,monospace', fontSize:'16px',
                  color:'#00ff88', fontWeight:'700' }}>{goal.daysRemaining}</div>
                <div style={{ fontSize:'11px', color:'#7a9bb5', marginTop:'4px' }}>DAYS LEFT</div>
              </div>
            </div>
          </div>
        )}

        {/* Quick nav */}
        <div style={{ background:'#0d1528', border:'1px solid rgba(0,212,255,0.15)',
          borderRadius:'16px', padding:'24px' }}>
          <div style={{ fontFamily:'Orbitron,monospace', fontSize:'11px',
            color:'#7a9bb5', letterSpacing:'2px', marginBottom:'20px' }}>
            QUICK ACTIONS
          </div>


          
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            {[
              { label:'UPDATE PROFILE',  path:'/profile', color:'#00d4ff', icon:'👤' },
              { label:'CHANGE GOAL',     path:'/goal',    color:'#ff6b35', icon:'🎯' },
              { label:'VIEW FULL PLANS', path:'/plans',   color:'#00ff88', icon:'📋' },
              { label:'TRACK PROGRESS', path:'/progress', color:'#a855f7', icon:'📈' },
            ].map(item => (
              <button key={item.path} onClick={() => navigate(item.path)}
                style={{ background:'rgba(0,212,255,0.03)',
                  border:`1px solid ${item.color}22`, borderRadius:'10px',
                  padding:'14px 18px', cursor:'pointer', textAlign:'left',
                  display:'flex', alignItems:'center', gap:'12px',
                  transition:'all 0.2s', width:'100%' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = item.color}
                onMouseLeave={e => e.currentTarget.style.borderColor = `${item.color}22`}>
                <span style={{ fontSize:'18px' }}>{item.icon}</span>
                <span style={{ fontFamily:'Orbitron,monospace', fontSize:'11px',
                  fontWeight:'700', letterSpacing:'2px', color:item.color }}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}