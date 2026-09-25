import React from 'react';

export const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        
        <div className="hero-text-side">
          <h1 className="hero-title">
            Impulsando la <br/>
            <span className="hero-highlight">Producción Local</span>
          </h1>
          <p>Conectamos directamente a los productores primarios de Formosa con hogares, comercios e industrias.</p>
        </div>

        <div className="hero-cards-side">
          {/* Tarjeta 1 */}
          <div className="hero-card">
            <h3 className="hero-card-title">¿Buscas productos terminados?</h3>
            <p style={{marginBottom: '16px'}}>Mermeladas, miel pura, cosmética y canastas.</p>
            <a href="#vitrina" className="navbar-btn" style={{display: 'inline-block'}}>
              Ir a la Vitrina
            </a>
          </div>
          
          {/* Tarjeta 2 */}
          <div className="hero-card">
            <h3 className="hero-card-title">¿Buscas materia prima?</h3>
            <p style={{marginBottom: '16px'}}>Conecta a granel con productores primarios.</p>
            <a href="#donde-nace" className="navbar-btn" style={{display: 'inline-block', backgroundColor: 'var(--cornsilk)'}}>
              Ver Mapa Provincial
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};