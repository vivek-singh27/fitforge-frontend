import Navbar from './Navbar';

export default function AppLayout({ children }) {
  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#050810' }}>
      <Navbar />
      <div style={{ flex:1, overflowY:'auto', overflowX:'hidden',
        // Push content down on mobile for fixed top navbar
        paddingTop: 0 }}
        className="main-content">
        <style>{`
          @media (max-width: 768px) {
            .main-content { padding-top: 56px !important; }
          }
        `}</style>
        {children}
      </div>
    </div>
  );
}