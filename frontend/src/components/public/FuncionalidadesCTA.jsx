import React, { useState } from 'react';

export const FuncionalidadesCTA = () => {
  const [activeRole, setActiveRole] = useState('emprendedor');

  return (
    <section className="func-cta-section" id="cta-funcionalidades">
      
      {/* =========================================
          TARJETA SUPERIOR (B2B: Emprendedores y Productores)
          ========================================= */}
      <div className="func-b2b-card">
        
        <div className="func-b2b-img-wrapper">
          <img 
            src="https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&w=800&q=80" 
            alt="Productores y Emprendedores" 
          />
          <div className="func-b2b-overlay">
            <button className="func-btn-float">
              <span className="material-symbols-outlined">handshake</span>
              Unirme a la Red
            </button>
          </div>
        </div>

        <div className="func-b2b-content">
          <div className="func-tabs">
            <button 
              onClick={() => setActiveRole('emprendedor')}
              className={`func-tab-btn ${activeRole === 'emprendedor' ? 'active' : ''}`}
            >
              Soy Emprendedor
            </button>
            <button 
              onClick={() => setActiveRole('productor')}
              className={`func-tab-btn ${activeRole === 'productor' ? 'active' : ''}`}
            >
              Soy Productor
            </button>
          </div>

          <div className="func-list">
            {activeRole === 'emprendedor' ? (
              <>
                <div className="func-list-item">
                  <span className="material-symbols-outlined func-list-icon">location_on</span>
                  <p className="func-list-text">Acceso a los mejores productores de la provincia con <strong>georreferencia exacta</strong>.</p>
                </div>
                <div className="func-list-item">
                  <span className="material-symbols-outlined func-list-icon">verified</span>
                  <p className="func-list-text">Fichas con <strong>calificaciones de confianza</strong> y volúmenes de stock real.</p>
                </div>
                <div className="func-list-item">
                  <span className="material-symbols-outlined func-list-icon">notifications_active</span>
                  <p className="func-list-text">Notificaciones y alertas de producción según la <strong>temporada de cosecha</strong>.</p>
                </div>
                <div className="func-list-item">
                  <span className="material-symbols-outlined func-list-icon">gpp_good</span>
                  <p className="func-list-text">Compra segura y transparente de <strong>materia prima fresca</strong> sin intermediarios.</p>
                </div>
              </>
            ) : (
              <>
                <div className="func-list-item">
                  <span className="material-symbols-outlined func-list-icon">storefront</span>
                  <p className="func-list-text">Herramientas intuitivas para <strong>publicar y vender</strong> tus cosechas o productos.</p>
                </div>
                <div className="func-list-item">
                  <span className="material-symbols-outlined func-list-icon">wifi_tethering</span>
                  <p className="func-list-text">Sistema optimizado para <strong>romper la brecha de conectividad</strong> en zonas rurales.</p>
                </div>
                <div className="func-list-item">
                  <span className="material-symbols-outlined func-list-icon">public</span>
                  <p className="func-list-text">Máxima <strong>visibilidad a nivel provincial</strong> ante comercios e industrias.</p>
                </div>
                <div className="func-list-item">
                  <span className="material-symbols-outlined func-list-icon">shield</span>
                  <p className="func-list-text"><strong>Seguridad garantizada</strong> sobre los datos y la identidad de a quién le vendes.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* =========================================
          TARJETA INFERIOR (B2C: Usuarios Finales)
          ========================================= */}
      <div className="func-b2c-card">
        <div className="func-b2c-info">
          <h3 className="func-b2c-title">¿Buscás productos listos para consumir?</h3>
          <p className="func-b2c-subtitle">Apoya la economía circular comprando directamente a los emprendedores de tu ciudad.</p>
          
          <div className="func-b2c-grid">
            <div className="func-feature-box">
              <div className="func-feature-icon-wrapper">
                <span className="material-symbols-outlined">shopping_basket</span>
              </div>
              <div>
                <h4 className="func-feature-title">Acceso Directo</h4>
                <p className="func-feature-desc">Conecta con artesanos, cocineros y productores locales.</p>
              </div>
            </div>
            
            <div className="func-feature-box">
              <div className="func-feature-icon-wrapper">
                <span className="material-symbols-outlined">tune</span>
              </div>
              <div>
                <h4 className="func-feature-title">Feed Personalizado</h4>
                <p className="func-feature-desc">Filtra por preferencias: Sin TACC, Orgánico, Vegetariano y más.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="func-b2c-action">
          <a href="#vitrina" className="func-btn-explore">
            <span className="material-symbols-outlined">explore</span>
            Explorar Productos
          </a>
        </div>
      </div>
    </section>
  );
};