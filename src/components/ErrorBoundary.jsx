import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight:'100vh', background:'#050810',
          display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center',
          fontFamily:'Orbitron,monospace', textAlign:'center', padding:'32px' }}>
          <div style={{ fontSize:'48px', marginBottom:'16px' }}>⚠</div>
          <div style={{ fontSize:'18px', fontWeight:'700', color:'#ff6b35',
            letterSpacing:'2px', marginBottom:'12px' }}>
            SOMETHING WENT WRONG
          </div>
          <div style={{ fontSize:'13px', color:'#7a9bb5',
            marginBottom:'28px', maxWidth:'400px', lineHeight:'1.7' }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </div>
          <button onClick={() => window.location.href = '/dashboard'}
            style={{ background:'linear-gradient(135deg,#00d4ff,#0099cc)',
              color:'#050810', border:'none', borderRadius:'8px',
              padding:'12px 28px', fontFamily:'Orbitron,monospace',
              fontSize:'12px', fontWeight:'700', letterSpacing:'2px',
              cursor:'pointer' }}>
            BACK TO DASHBOARD
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}