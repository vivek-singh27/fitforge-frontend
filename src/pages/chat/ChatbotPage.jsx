import { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../../api/chatApi';
import { useAuth } from '../../context/AuthContext';

export default function ChatbotPage() {
  const { user }                      = useAuth();
  const [messages, setMessages]       = useState([
    {
      role: 'bot',
      text: `Hey ${user?.username || 'there'}! 💪 I'm FitBot, your personal AI fitness assistant. I know your goals, diet plan, and workout plan. Ask me anything!`,
      time: new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })
    }
  ]);
  const [input, setInput]             = useState('');
  const [loading, setLoading]         = useState(false);
  const bottomRef                     = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = {
      role: 'user',
      text: input.trim(),
      time: new Date().toLocaleTimeString('en-IN',
        { hour:'2-digit', minute:'2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await sendMessage(userMsg.text);
      setMessages(prev => [...prev, {
        role: 'bot',
        text: res.data.reply,
        time: res.data.timestamp
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'bot',
        text: 'Sorry, I had trouble connecting. Please try again!',
        time: new Date().toLocaleTimeString('en-IN',
          { hour:'2-digit', minute:'2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Quick suggestion chips
  const suggestions = [
    'What should I eat today?',
    'How many calories do I need?',
    'What is my workout today?',
    'How is my progress?',
    'What is my BMI?',
    'Tips to stay motivated',
  ];

  return (
    <div style={{ padding:'24px', background:'#050810',
      minHeight:'100vh', display:'flex', flexDirection:'column' }}>

      {/* Header */}
      <div style={{ marginBottom:'20px' }}>
        <h1 style={{ fontFamily:'Orbitron,monospace', fontSize:'22px',
          fontWeight:'900' }}>
          FIT<span style={{ background:'linear-gradient(135deg,#00d4ff,#ff6b35)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            BOT
          </span>
        </h1>
        <p style={{ color:'#7a9bb5', fontSize:'14px', marginTop:'4px' }}>
          Your personal AI fitness assistant — powered by Groq AI
        </p>
      </div>

      {/* Chat container */}
      <div style={{ flex:1, display:'flex', flexDirection:'column',
        background:'#0d1528', border:'1px solid rgba(0,212,255,0.15)',
        borderRadius:'16px', overflow:'hidden',
        maxHeight:'calc(100vh - 200px)' }}>

        {/* Messages */}
        <div style={{ flex:1, overflowY:'auto', padding:'20px',
          display:'flex', flexDirection:'column', gap:'16px' }}>

          {messages.map((msg, i) => (
            <div key={i} style={{ display:'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              alignItems:'flex-end', gap:'10px' }}>

              {/* Bot avatar */}
              {msg.role === 'bot' && (
                <div style={{ width:'32px', height:'32px', borderRadius:'50%',
                  background:'linear-gradient(135deg,#00d4ff,#0099cc)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'14px', flexShrink:0 }}>
                  🤖
                </div>
              )}

              <div style={{ maxWidth:'70%' }}>
                {/* Message bubble */}
                <div style={{
                  padding:'12px 16px',
                  borderRadius: msg.role === 'user'
                    ? '16px 16px 4px 16px'
                    : '16px 16px 16px 4px',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg,#00d4ff,#0099cc)'
                    : 'rgba(255,255,255,0.06)',
                  color: msg.role === 'user' ? '#050810' : '#e8f4ff',
                  fontSize:'14px', lineHeight:'1.6',
                  fontWeight: msg.role === 'user' ? '600' : '400',
                  border: msg.role === 'bot'
                    ? '1px solid rgba(0,212,255,0.1)' : 'none',
                  whiteSpace:'pre-wrap',
                }}>
                  {msg.text}
                </div>
                {/* Timestamp */}
                <div style={{ fontSize:'10px', color:'#7a9bb5',
                  marginTop:'4px',
                  textAlign: msg.role === 'user' ? 'right' : 'left',
                  paddingLeft: msg.role === 'bot' ? '4px' : '0' }}>
                  {msg.time}
                </div>
              </div>

              {/* User avatar */}
              {msg.role === 'user' && (
                <div style={{ width:'32px', height:'32px', borderRadius:'50%',
                  background:'linear-gradient(135deg,#ff6b35,#cc4400)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontFamily:'Orbitron,monospace', fontSize:'12px',
                  fontWeight:'700', color:'white', flexShrink:0 }}>
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div style={{ display:'flex', alignItems:'flex-end', gap:'10px' }}>
              <div style={{ width:'32px', height:'32px', borderRadius:'50%',
                background:'linear-gradient(135deg,#00d4ff,#0099cc)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'14px' }}>🤖</div>
              <div style={{ padding:'12px 16px', borderRadius:'16px 16px 16px 4px',
                background:'rgba(255,255,255,0.06)',
                border:'1px solid rgba(0,212,255,0.1)',
                display:'flex', gap:'4px', alignItems:'center' }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width:'8px', height:'8px',
                    borderRadius:'50%', background:'#00d4ff',
                    animation:'bounce 1s infinite',
                    animationDelay:`${i * 0.2}s`,
                    opacity:0.7 }}/>
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef}/>
        </div>

        {/* Suggestion chips */}
        {messages.length <= 1 && (
          <div style={{ padding:'0 20px 12px',
            display:'flex', flexWrap:'wrap', gap:'8px' }}>
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => setInput(s)}
                style={{ background:'rgba(0,212,255,0.06)',
                  border:'1px solid rgba(0,212,255,0.2)',
                  color:'#00d4ff', borderRadius:'20px',
                  padding:'6px 14px', fontSize:'12px',
                  cursor:'pointer', fontFamily:'Rajdhani,sans-serif',
                  fontWeight:'600', transition:'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(0,212,255,0.12)'}
                onMouseLeave={e => e.currentTarget.style.background='rgba(0,212,255,0.06)'}>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        <div style={{ padding:'16px 20px',
          borderTop:'1px solid rgba(0,212,255,0.1)',
          display:'flex', gap:'12px', alignItems:'center' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask me anything about your fitness..."
            disabled={loading}
            style={{ flex:1, background:'rgba(0,212,255,0.04)',
              border:'1px solid rgba(0,212,255,0.2)',
              borderRadius:'12px', padding:'12px 16px',
              color:'#e8f4ff', fontFamily:'Rajdhani,sans-serif',
              fontSize:'15px', outline:'none', colorScheme:'dark',
              opacity: loading ? 0.6 : 1 }}
            onFocus={e => e.target.style.borderColor='#00d4ff'}
            onBlur={e => e.target.style.borderColor='rgba(0,212,255,0.2)'}
          />
          <button onClick={handleSend} disabled={loading || !input.trim()}
            style={{ width:'48px', height:'48px', borderRadius:'12px',
              background: loading || !input.trim()
                ? 'rgba(0,212,255,0.2)'
                : 'linear-gradient(135deg,#00d4ff,#0099cc)',
              border:'none', cursor: loading || !input.trim()
                ? 'not-allowed' : 'pointer',
              display:'flex', alignItems:'center',
              justifyContent:'center', fontSize:'20px',
              transition:'all 0.3s', flexShrink:0 }}>
            {loading ? '⏳' : '➤'}
          </button>
        </div>
      </div>

      {/* Bounce animation */}
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}