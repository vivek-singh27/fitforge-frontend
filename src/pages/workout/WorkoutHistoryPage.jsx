import { useEffect, useState } from 'react';
import { getWorkoutLogs, logWorkout, getWeeklyCount } from '../../api/trackingApi';

export default function WorkoutHistoryPage() {
  const [logs, setLogs]           = useState([]);
  const [weeklyCount, setWeekly]  = useState(0);
  const [loading, setLoading]     = useState(true);
  const [msg, setMsg]             = useState('');
  const [form, setForm]           = useState({
    dayLabel:'', durationMinutes:'', notes:'',
    workoutDate: new Date().toISOString().split('T')[0]
  });

  const dayOptions = [
    'Push Day','Pull Day','Leg Day',
    'Full Body','Upper Body','Lower Body',
    'Cardio','Rest Day'
  ];

  const fetchData = () => {
    Promise.all([getWorkoutLogs(), getWeeklyCount()])
      .then(([l, w]) => {
        setLogs(l.data);
        setWeekly(w.data.weeklyCount);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await logWorkout({
        dayLabel:        form.dayLabel,
        durationMinutes: form.durationMinutes ? parseInt(form.durationMinutes) : null,
        notes:           form.notes || null,
        workoutDate:     form.workoutDate,
        completed:       true,
      });
      setMsg('✓ Workout logged!');
      setForm({ dayLabel:'', durationMinutes:'', notes:'',
        workoutDate: new Date().toISOString().split('T')[0] });
      fetchData();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error logging workout');
    }
    setTimeout(() => setMsg(''), 3000);
  };

  const inputStyle = {
    width:'100%', background:'rgba(0,212,255,0.04)',
    border:'1px solid rgba(0,212,255,0.15)', borderRadius:'8px',
    padding:'12px 16px', color:'#e8f4ff',
    fontFamily:'Rajdhani,sans-serif', fontSize:'15px',
    outline:'none', marginTop:'6px'
  };

  const dayColor = (label) => {
    if (label?.includes('Push'))  return '#00d4ff';
    if (label?.includes('Pull'))  return '#ff6b35';
    if (label?.includes('Leg'))   return '#00ff88';
    if (label?.includes('Full'))  return '#a855f7';
    if (label?.includes('Cardio'))return '#eab308';
    if (label?.includes('Rest'))  return '#7a9bb5';
    return '#00d4ff';
  };

  // Weekly heatmap — last 7 days
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const log = logs.find(l => l.workoutDate === dateStr);
    return { date: d, dateStr, log };
  });

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
      height:'100vh', background:'#050810', color:'#00d4ff',
      fontFamily:'Orbitron,monospace', fontSize:'13px', letterSpacing:'3px' }}>
      LOADING...
    </div>
  );

  return (
    <div className="page-wrap" style={{ background:'#050810', minHeight:'100vh' }}>

      {/* Header */}
      <div className="page-header">
        <div className="page-title">
          WORKOUT <span>HISTORY</span>
        </div>
        <p className="page-sub">Log and track your training sessions</p>
      </div>

      {/* Stat row */}
      <div className="grid-4" style={{ marginBottom:'24px' }}>
        {[
          { label:'THIS WEEK',    val:weeklyCount,  sub:'sessions',  color:'#00d4ff' },
          { label:'TOTAL LOGGED', val:logs.length,  sub:'workouts',  color:'#ff6b35' },
          { label:'STREAK',
            val: (() => {
              let streak = 0;
              const sorted = [...logs].sort((a,b) =>
                new Date(b.workoutDate) - new Date(a.workoutDate));
              for (let i = 0; i < sorted.length; i++) {
                const expected = new Date();
                expected.setDate(expected.getDate() - i);
                const expStr = expected.toISOString().split('T')[0];
                if (sorted[i]?.workoutDate === expStr) streak++;
                else break;
              }
              return streak;
            })(),
            sub:'day streak', color:'#00ff88' },
          { label:'LAST SESSION',
            val: logs[0]
              ? new Date(logs[0].workoutDate).toLocaleDateString('en-IN',
                  { day:'numeric', month:'short' })
              : '--',
            sub: logs[0]?.dayLabel || 'No sessions yet', color:'#a855f7' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{
            borderColor:`${s.color}22` }}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color:s.color,
              fontSize:'22px' }}>{s.val}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Weekly heatmap */}
      <div className="ff-card" style={{ marginBottom:'24px' }}>
        <div className="sec-title">THIS WEEK</div>
        <div style={{ display:'flex', gap:'8px' }}>
          {last7.map(({ date, dateStr, log }) => (
            <div key={dateStr} style={{ flex:1, textAlign:'center' }}>
              <div style={{ fontSize:'10px', color:'#7a9bb5',
                marginBottom:'8px', letterSpacing:'1px' }}>
                {date.toLocaleDateString('en-IN', { weekday:'short' })
                     .toUpperCase()}
              </div>
              <div style={{ height:'48px', borderRadius:'8px',
                background: log
                  ? `linear-gradient(135deg,${dayColor(log.dayLabel)},${dayColor(log.dayLabel)}88)`
                  : 'rgba(255,255,255,0.04)',
                border:`1px solid ${log ? dayColor(log.dayLabel)+'44' : 'rgba(255,255,255,0.06)'}`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'18px', transition:'all 0.3s' }}>
                {log ? '💪' : '·'}
              </div>
              <div style={{ fontSize:'10px', color:'#7a9bb5', marginTop:'6px' }}>
                {date.getDate()}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2">

        {/* Log form */}
        <div className="ff-card">
          <div className="sec-title">LOG A SESSION</div>

          {msg && (
            <div style={{ marginBottom:'16px', padding:'12px', borderRadius:'8px',
              background: msg.startsWith('✓') ? 'rgba(0,255,136,0.08)' : 'rgba(255,107,53,0.08)',
              border:`1px solid ${msg.startsWith('✓') ? 'rgba(0,255,136,0.25)' : 'rgba(255,107,53,0.25)'}`,
              color: msg.startsWith('✓') ? '#00ff88' : '#ff6b35',
              fontSize:'13px' }}>
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:'16px' }}>
              <label className="ff-label">WORKOUT TYPE *</label>
              <select style={inputStyle} value={form.dayLabel} required
                onChange={e => setForm({...form, dayLabel: e.target.value})}>
                <option value="">Select workout type</option>
                {dayOptions.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom:'16px' }}>
              <label className="ff-label">DATE</label>
              <input style={inputStyle} type="date"
                value={form.workoutDate}
                max={new Date().toISOString().split('T')[0]}
                onChange={e => setForm({...form, workoutDate: e.target.value})}/>
            </div>
            <div style={{ marginBottom:'16px' }}>
              <label className="ff-label">DURATION (MINUTES)</label>
              <input style={inputStyle} type="number"
                placeholder="e.g. 60"
                value={form.durationMinutes}
                onChange={e => setForm({...form, durationMinutes: e.target.value})}/>
            </div>
            <div style={{ marginBottom:'24px' }}>
              <label className="ff-label">NOTES</label>
              <input style={inputStyle} type="text"
                placeholder="How was the session?"
                value={form.notes}
                onChange={e => setForm({...form, notes: e.target.value})}/>
            </div>
            <button type="submit" className="ff-btn ff-btn-cyan">
              + LOG WORKOUT
            </button>
          </form>
        </div>

        {/* History list */}
        <div className="ff-card">
          <div className="sec-title">RECENT SESSIONS</div>
          {logs.length > 0 ? (
            <div style={{ maxHeight:'480px', overflowY:'auto' }}>
              {logs.slice(0, 20).map(log => (
                <div key={log.id} style={{ display:'flex', justifyContent:'space-between',
                  alignItems:'center', padding:'14px',
                  background:'rgba(0,212,255,0.03)',
                  border:'1px solid rgba(0,212,255,0.08)',
                  borderRadius:'10px', marginBottom:'10px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                    <div style={{ width:'40px', height:'40px', borderRadius:'10px',
                      background:`${dayColor(log.dayLabel)}15`,
                      border:`1px solid ${dayColor(log.dayLabel)}33`,
                      display:'flex', alignItems:'center',
                      justifyContent:'center', fontSize:'18px' }}>
                      💪
                    </div>
                    <div>
                      <div style={{ fontFamily:'Orbitron,monospace', fontSize:'11px',
                        color:dayColor(log.dayLabel), letterSpacing:'1px' }}>
                        {log.dayLabel}
                      </div>
                      {log.notes && (
                        <div style={{ fontSize:'12px', color:'#7a9bb5',
                          marginTop:'3px' }}>{log.notes}</div>
                      )}
                    </div>
                  </div>
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <div style={{ fontFamily:'Orbitron,monospace',
                      fontSize:'11px', color:'#e8f4ff' }}>
                      {new Date(log.workoutDate).toLocaleDateString('en-IN',
                        { day:'numeric', month:'short' })}
                    </div>
                    {log.durationMinutes && (
                      <div style={{ fontSize:'11px', color:'#7a9bb5',
                        marginTop:'3px' }}>{log.durationMinutes} min</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🏋️</div>
              <div className="empty-title">NO SESSIONS YET</div>
              <div className="empty-sub">
                Log your first workout session<br/>to start tracking your training
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}