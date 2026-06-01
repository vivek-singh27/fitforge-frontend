import { useEffect, useState } from 'react';
import { logProgress, getSummary } from '../../api/trackingApi';

// SVG Chart — no canvas sizing issues
function WeightChart({ logs }) {
  if (!logs || logs.length < 2) return null;

  const W = 600, H = 260;
  const pad = { top: 30, right: 20, bottom: 40, left: 55 };

  const weights  = logs.map(l => l.weightKg);
  const minW     = Math.min(...weights) - 1.5;
  const maxW     = Math.max(...weights) + 1.5;
  const innerW   = W - pad.left - pad.right;
  const innerH   = H - pad.top  - pad.bottom;

  const xPos = (i) =>
    pad.left + (i / (logs.length - 1)) * innerW;
  const yPos = (w) =>
    pad.top + (1 - (w - minW) / (maxW - minW)) * innerH;

  // Build polyline points
  const points = logs
    .map((l, i) => `${xPos(i)},${yPos(l.weightKg)}`)
    .join(' ');

  // Area fill path
  const areaPath =
    `M ${xPos(0)},${yPos(logs[0].weightKg)} ` +
    logs.map((l, i) => `L ${xPos(i)},${yPos(l.weightKg)}`).join(' ') +
    ` L ${xPos(logs.length - 1)},${H - pad.bottom}` +
    ` L ${xPos(0)},${H - pad.bottom} Z`;

  // Y axis grid values
  const gridLines = [0, 1, 2, 3, 4].map(i => ({
    y:   pad.top + (i / 4) * innerH,
    val: (maxW - (i / 4) * (maxW - minW)).toFixed(1),
  }));

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', height: 'auto', display: 'block' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#00d4ff" stopOpacity="0.35"/>
          <stop offset="100%" stopColor="#00d4ff" stopOpacity="0"/>
        </linearGradient>
      </defs>

      {/* Grid lines + Y labels */}
      {gridLines.map((g, i) => (
        <g key={i}>
          <line
            x1={pad.left} y1={g.y}
            x2={W - pad.right} y2={g.y}
            stroke="rgba(0,212,255,0.08)"
            strokeWidth="1"
            strokeDasharray="4,4"
          />
          <text
            x={pad.left - 8} y={g.y + 4}
            textAnchor="end"
            fill="#7a9bb5"
            fontSize="11"
            fontFamily="sans-serif"
          >
            {g.val}kg
          </text>
        </g>
      ))}

      {/* Area fill */}
      <path d={areaPath} fill="url(#areaGrad)" />

      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke="#00d4ff"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Dots + labels */}
      {logs.map((l, i) => {
        const x = xPos(i);
        const y = yPos(l.weightKg);
        const d = new Date(l.logDate);
        const dateStr = `${d.getDate()}/${d.getMonth() + 1}`;

        return (
          <g key={l.id || i}>
            {/* Glow ring */}
            <circle cx={x} cy={y} r="8"
              fill="rgba(0,212,255,0.15)"/>

            {/* Dot */}
            <circle cx={x} cy={y} r="4"
              fill="#00d4ff" stroke="#050810" strokeWidth="2"/>

            {/* Weight label above */}
            <text
              x={x} y={y - 14}
              textAnchor="middle"
              fill="#e8f4ff"
              fontSize="10"
              fontFamily="sans-serif"
              fontWeight="bold"
            >
              {l.weightKg}kg
            </text>

            {/* Date label below x axis */}
            <text
              x={x} y={H - pad.bottom + 18}
              textAnchor="middle"
              fill="#7a9bb5"
              fontSize="10"
              fontFamily="sans-serif"
            >
              {dateStr}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function ProgressPage() {
  const [summary, setSummary] = useState(null);
  const [form, setForm]       = useState({ weightKg:'', bodyFatPct:'', notes:'' });
  const [msg, setMsg]         = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSummary()
      .then(r  => setSummary(r.data))
      .catch(() => setSummary(null))
      .finally(()=> setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await logProgress({
        weightKg:   parseFloat(form.weightKg),
        bodyFatPct: form.bodyFatPct ? parseFloat(form.bodyFatPct) : null,
        notes:      form.notes || null,
      });
      setMsg('✓ Progress logged!');
      setForm({ weightKg:'', bodyFatPct:'', notes:'' });
      const r = await getSummary();
      setSummary(r.data);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error logging progress');
    }
    setTimeout(() => setMsg(''), 3000);
  };

  const statBox = (label, value, color) => (
    <div style={{ background:'#0d1528', border:`1px solid ${color}22`,
      borderRadius:'12px', padding:'20px', textAlign:'center' }}>
      <div style={{ fontSize:'11px', color:'#7a9bb5',
        letterSpacing:'2px', marginBottom:'8px' }}>{label}</div>
      <div style={{ fontFamily:'Orbitron,monospace', fontSize:'22px',
        fontWeight:'700', color }}>{value ?? '--'}</div>
    </div>
  );

  const inputStyle = {
    width:'100%', background:'rgba(0,212,255,0.04)',
    border:'1px solid rgba(0,212,255,0.15)', borderRadius:'8px',
    padding:'12px 16px', color:'#e8f4ff',
    fontFamily:'Rajdhani,sans-serif', fontSize:'15px',
    outline:'none', marginTop:'6px'
  };

  return (
    <div style={{ padding:'32px', background:'#050810', minHeight:'100vh' }}>

      {/* Header */}
      <div style={{ marginBottom:'32px' }}>
        <h1 style={{ fontFamily:'Orbitron,monospace', fontSize:'22px', fontWeight:'900' }}>
          PROGRESS{' '}
          <span style={{ background:'linear-gradient(135deg,#00d4ff,#ff6b35)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            TRACKER
          </span>
        </h1>
        <p style={{ color:'#7a9bb5', fontSize:'14px', marginTop:'6px' }}>
          Log your daily weight and track your transformation
        </p>
      </div>

      {/* Stat cards */}
      {summary?.totalLogsCount > 0 && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)',
          gap:'16px', marginBottom:'28px' }}>
          {statBox('START WEIGHT',
            `${summary.startWeight}kg`, '#7a9bb5')}
          {statBox('CURRENT WEIGHT',
            `${summary.currentWeight}kg`, '#00d4ff')}
          {statBox('TOTAL CHANGE',
            `${summary.totalChange > 0 ? '+' : ''}${summary.totalChange}kg`,
            summary.totalChange <= 0 ? '#00ff88' : '#ff6b35')}
          {statBox('LOGS RECORDED',
            summary.totalLogsCount, '#a855f7')}
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1.6fr', gap:'24px' }}>

        {/* Form */}
        <div style={{ background:'#0d1528', border:'1px solid rgba(0,212,255,0.15)',
          borderRadius:'16px', padding:'28px' }}>
          <div style={{ fontFamily:'Orbitron,monospace', fontSize:'11px',
            color:'#7a9bb5', letterSpacing:'2px', marginBottom:'20px' }}>
            LOG TODAY'S PROGRESS
          </div>

          {msg && (
            <div style={{ marginBottom:'16px', padding:'12px', borderRadius:'8px',
              background: msg.startsWith('✓')
                ? 'rgba(0,255,136,0.08)' : 'rgba(255,107,53,0.08)',
              border:`1px solid ${msg.startsWith('✓')
                ? 'rgba(0,255,136,0.25)' : 'rgba(255,107,53,0.25)'}`,
              color: msg.startsWith('✓') ? '#00ff88' : '#ff6b35',
              fontSize:'13px', letterSpacing:'1px' }}>
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:'16px' }}>
              <label style={{ fontSize:'11px', color:'#7a9bb5',
                letterSpacing:'2px', display:'block' }}>WEIGHT (KG) *</label>
              <input style={inputStyle} type="number" step="0.1"
                placeholder="e.g. 72.4" required
                value={form.weightKg}
                onChange={e => setForm({...form, weightKg: e.target.value})}/>
            </div>
            <div style={{ marginBottom:'16px' }}>
              <label style={{ fontSize:'11px', color:'#7a9bb5',
                letterSpacing:'2px', display:'block' }}>BODY FAT % (OPTIONAL)</label>
              <input style={inputStyle} type="number" step="0.1"
                placeholder="e.g. 18.5"
                value={form.bodyFatPct}
                onChange={e => setForm({...form, bodyFatPct: e.target.value})}/>
            </div>
            <div style={{ marginBottom:'24px' }}>
              <label style={{ fontSize:'11px', color:'#7a9bb5',
                letterSpacing:'2px', display:'block' }}>NOTES (OPTIONAL)</label>
              <input style={inputStyle} type="text"
                placeholder="How do you feel today?"
                value={form.notes}
                onChange={e => setForm({...form, notes: e.target.value})}/>
            </div>
            <button type="submit" style={{
              width:'100%',
              background:'linear-gradient(135deg,#00d4ff,#0099cc)',
              color:'#050810', border:'none', borderRadius:'8px',
              padding:'13px', fontFamily:'Orbitron,monospace',
              fontSize:'12px', fontWeight:'700',
              letterSpacing:'2px', cursor:'pointer' }}>
              LOG PROGRESS
            </button>
          </form>

          {/* Recent logs list */}
          {summary?.logs?.length > 0 && (
            <div style={{ marginTop:'28px' }}>
              <div style={{ fontFamily:'Orbitron,monospace', fontSize:'11px',
                color:'#7a9bb5', letterSpacing:'2px', marginBottom:'14px' }}>
                RECENT LOGS
              </div>
              <div style={{ maxHeight:'200px', overflowY:'auto' }}>
                {[...summary.logs].reverse().slice(0, 10).map((log) => (
                  <div key={log.id} style={{
                    display:'flex', justifyContent:'space-between',
                    alignItems:'center', padding:'10px 0',
                    borderBottom:'1px solid rgba(0,212,255,0.06)' }}>
                    <div>
                      <div style={{ fontFamily:'Orbitron,monospace',
                        fontSize:'12px', color:'#e8f4ff' }}>
                        {new Date(log.logDate).toLocaleDateString('en-IN',
                          { day:'numeric', month:'short' })}
                      </div>
                      {log.notes && (
                        <div style={{ fontSize:'11px', color:'#7a9bb5',
                          marginTop:'2px' }}>{log.notes}</div>
                      )}
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontFamily:'Orbitron,monospace',
                        fontSize:'14px', color:'#00d4ff' }}>
                        {log.weightKg}kg
                      </div>
                      {log.changeFromPrevious != null && (
                        <div style={{ fontSize:'11px', marginTop:'2px',
                          color: log.changeFromPrevious <= 0 ? '#00ff88' : '#ff6b35' }}>
                          {log.changeFromPrevious > 0 ? '+' : ''}
                          {log.changeFromPrevious}kg
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Chart panel */}
        <div style={{ background:'#0d1528', border:'1px solid rgba(0,212,255,0.15)',
          borderRadius:'16px', padding:'28px' }}>
          <div style={{ fontFamily:'Orbitron,monospace', fontSize:'11px',
            color:'#7a9bb5', letterSpacing:'2px', marginBottom:'20px',
            display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span>WEIGHT HISTORY — LAST 30 DAYS</span>
            {summary?.totalLogsCount > 1 && (
              <span style={{
                color: summary.totalChange <= 0 ? '#00ff88' : '#ff6b35',
                fontFamily:'Orbitron,monospace', fontSize:'12px' }}>
                {summary.totalChange > 0 ? '▲' : '▼'} {Math.abs(summary.totalChange)}kg
              </span>
            )}
          </div>

          {loading ? (
            <div style={{ display:'flex', alignItems:'center',
              justifyContent:'center', height:'260px', color:'#00d4ff',
              fontFamily:'Orbitron,monospace', fontSize:'12px',
              letterSpacing:'2px' }}>
              LOADING...
            </div>

          ) : summary?.logs?.length > 1 ? (
            /* SVG chart — no canvas sizing issues */
            <WeightChart logs={summary.logs} />

          ) : (
            <div style={{ display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'center',
              height:'260px', color:'#7a9bb5' }}>
              <div style={{ fontFamily:'Orbitron,monospace', fontSize:'13px',
                letterSpacing:'2px', marginBottom:'12px', color:'#00d4ff' }}>
                {summary?.totalLogsCount === 1
                  ? 'ONE MORE ENTRY NEEDED' : 'NO DATA YET'}
              </div>
              <div style={{ fontSize:'13px', textAlign:'center',
                lineHeight:'1.8' }}>
                {summary?.totalLogsCount === 1
                  ? 'You have 1 log. Add one\nmore to see your chart.'
                  : 'Log at least 2 weight\nentries to see the chart.'}
              </div>
            </div>
          )}

          {/* Stats row */}
          {summary?.logs?.length > 1 && (
            <div style={{ display:'flex', justifyContent:'space-around',
              marginTop:'20px', paddingTop:'20px',
              borderTop:'1px solid rgba(0,212,255,0.1)' }}>
              {[
                { label:'LOWEST',  val:`${summary.lowestWeight}kg`,  color:'#00ff88' },
                { label:'HIGHEST', val:`${summary.highestWeight}kg`, color:'#ff6b35' },
                { label:'ENTRIES', val:summary.totalLogsCount,       color:'#a855f7' },
              ].map(s => (
                <div key={s.label} style={{ textAlign:'center' }}>
                  <div style={{ fontFamily:'Orbitron,monospace',
                    fontSize:'18px', fontWeight:'700', color:s.color }}>
                    {s.val}
                  </div>
                  <div style={{ fontSize:'10px', color:'#7a9bb5',
                    letterSpacing:'2px', marginTop:'4px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}