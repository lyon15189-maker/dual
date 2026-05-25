import React from 'react';

const Loader = ({ visible = false, texto = "Cargando" }) => {
  if (!visible) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <div style={styles.spinner}></div>
        <p style={styles.texto}>{texto}<span className="dots"></span></p>
      </div>

      <style jsx>{`
        .dots::after {
          content: '';
          animation: dots 1.5s steps(3, end) infinite;
        }

        @keyframes dots {
          0% { content: ''; }
          33% { content: '.'; }
          66% { content: '..'; }
          100% { content: '...'; }
        }
      `}</style>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999999999, // 👈 SIEMPRE arriba
  },
  container: {
    textAlign: 'center',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid rgba(255,255,255,0.2)',
    borderTop: '5px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px',
  },
  texto: {
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
  },
};

// Animación global (importante)
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

export default Loader;