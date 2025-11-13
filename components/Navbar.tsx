import React from 'react';
import type { User } from '../types';

interface NavbarProps {
  currentUser: User | null;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  currentUser, 
  onLoginClick, 
  onRegisterClick, 
  onLogout 
}) => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h2>Sistema de Tickets</h2>
      </div>
      <div className="nav-actions">
        {currentUser ? (
          <div className="user-info">
            <span>Bienvenido, {currentUser.nombres} {currentUser.apellidos}</span>
            <button onClick={onLogout} className="btn btn-secondary">
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <button onClick={onLoginClick} className="btn btn-primary">
              Iniciar Sesión
            </button>
            <button onClick={onRegisterClick} className="btn btn-secondary">
              Registrarse
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;