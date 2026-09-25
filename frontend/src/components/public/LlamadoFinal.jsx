import React from 'react';
import { Link } from 'react-router-dom';

export const LlamadoFinal = () => {
  return (
    <section className="container-max">
      <div className="final-cta-container">
        <h2 className="final-cta-title">¿Buscás productos listos para consumir?</h2>
        <p style={{fontSize: '1.125rem', marginBottom: '32px', opacity: 0.9}}>
          Apoya la economía circular comprando directamente a los emprendedores de tu ciudad. Filtra por productos Sin TACC, Orgánicos o Vegetales.
        </p>
        <Link to="/register" className="navbar-btn" style={{padding: '16px 32px', fontSize: '1rem'}}>
          <span className="material-symbols-outlined">explore</span>
          Explorar Productos y Registrarme
        </Link>
      </div>
    </section>
  );
};