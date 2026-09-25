import React, { useState, useEffect } from 'react';

export const Navbar = () => {
  const [activeSection, setActiveSection] = useState('');

  // 1. Enlaces exactos que pediste
  const navItems = [
    { label: '¿Dónde Nace?', id: 'donde-nace' },
    { label: 'Qué ofrecemos', id: 'diferencias' }, // Apunta directo a tu tarjeta animada
    { label: 'Radar de Frescura', id: 'radar' },
    { label: 'Vitrina Productiva', id: 'vitrina' }
  ];

useEffect(() => {
    const handleScroll = () => {
      let actual = '';
      const mitadPantalla = window.innerHeight / 2;
      
      navItems.forEach((item) => {
        const section = document.getElementById(item.id);
        if (section) {
          const rect = section.getBoundingClientRect();
          // Solo se activa si la parte de arriba está por encima de la mitad 
          // Y la parte de abajo de la sección aún no cruzó la mitad
          if (rect.top <= mitadPantalla && rect.bottom >= mitadPantalla) {
            actual = item.id;
          }
        }
      });
      
      if (actual) setActiveSection(actual);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="navbar-header">
      <div className="navbar-pill">
        
        <a href="/" className="navbar-logo">🌱 EcoNexo</a>
        
        <nav className="navbar-links">
          {navItems.map((item) => (
            <a 
              key={item.id} 
              className={`navbar-link-item ${activeSection === item.id ? 'activo' : ''}`} 
              href={`#${item.id}`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a href="#vitrina" className="navbar-btn">Ingresar / Explorar</a>
        
      </div>
    </header>
  );
};