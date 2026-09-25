import React from 'react';
import { Navbar } from '../components/public/Navbar';

export const PublicLayout = ({ children }) => {
  return (
    <div className="layout-wrapper">
      <Navbar />
      <main className="layout-main">
        {children}
      </main>
      <footer className="layout-footer">
         © 2026 EcoNexo Formosa. Red Agroproductiva.
      </footer>
    </div>
  );
};