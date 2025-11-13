import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import LoginModal from '../components/LoginModal';
import RegisterModal from '../components/RegisterModal';
import UserManagement from '../components/UserManagement';
import TicketList from '../components/TicketList';
import { NotificationProvider } from '../components/NotificationContext';
import type { User } from '../types';
import './App.css';

const AppContent: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setCurrentUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLoginSuccess = (token: string, user: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setCurrentUser(user);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const handleRegisterSuccess = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const canCreateTicket = currentUser?.role.name === 'usuario';

  const renderContent = () => {
    if (!currentUser) {
      return (
        <div className="welcome-section">
          <div className="welcome-content">
            <h1>Bienvenido al Sistema de Tickets</h1>
            <p>Gestiona y da seguimiento a tus tickets de soporte técnico</p>
            <div className="welcome-features">
              <div className="feature">
                <h3>Para Usuarios</h3>
                <p>Crea tickets de soporte y da seguimiento a tus solicitudes</p>
              </div>
              <div className="feature">
                <h3>Para Técnicos</h3>
                <p>Gestiona tickets asignados y actualiza su estado</p>
              </div>
              <div className="feature">
                <h3>Para Administradores</h3>
                <p>Gestiona usuarios y asigna tickets a técnicos</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Layout para admin: Tickets arriba, Usuarios abajo
    if (currentUser.role.name === 'admin') {
      return (
        <div className="main-content">
          <div className="admin-layout">
            {/* Sección de Tickets */}
            <div className="tickets-section">
              <div className="tickets-section-header">
                <h2>Tickets</h2>
                {canCreateTicket && (
                  <button 
                    onClick={() => setShowTicketForm(true)}
                    className="btn btn-primary"
                  >
                    Nuevo Ticket
                  </button>
                )}
              </div>
              
              {/* Filtros */}
              <div className="tickets-filters">
                <div className="filter-group">
                  <label>Estado</label>
                  <select 
                    value={filters.status} 
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="">Todos</option>
                    <option value="Abierto">Abierto</option>
                    <option value="En Progreso">En Progreso</option>
                    <option value="Completado">Completado</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Prioridad</label>
                  <select 
                    value={filters.priority} 
                    onChange={(e) => handleFilterChange('priority', e.target.value)}
                  >
                    <option value="">Todas</option>
                    <option value="alta">Alta</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Buscar</label>
                  <input 
                    type="text" 
                    placeholder="Buscar tickets..." 
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </div>
                {(filters.status || filters.priority || filters.search) && (
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => setFilters({ status: '', priority: '', search: '' })}
                  >
                    Limpiar Filtros
                  </button>
                )}
              </div>
              
              {/* Tickets en horizontal con scroll */}
              <div className="tickets-horizontal-container">
                <TicketList 
                  currentUser={currentUser} 
                  filters={filters}
                  showForm={showTicketForm}
                  onFormClose={() => setShowTicketForm(false)}
                />
              </div>
            </div>
            
            {/* Sección de Usuarios */}
            <div className="users-section">
              <div className="users-section-header">
                <h2>Gestión de Usuarios</h2>
              </div>
              <UserManagement currentUser={currentUser} />
            </div>
          </div>
        </div>
      );
    }

    // Layout para técnico/usuario normal: Solo tickets
    return (
      <div className="main-content">
        <div className="user-layout">
          <div className="tickets-section">
            <div className="tickets-section-header">
              <h2>
                {currentUser.role.name === 'tecnico' ? 'Tickets Asignados' : 'Mis Tickets'}
              </h2>
              {canCreateTicket && (
                <button 
                  onClick={() => setShowTicketForm(true)}
                  className="btn btn-primary"
                >
                  Nuevo Ticket
                </button>
              )}
            </div>
            
            {/* Filtros */}
            <div className="tickets-filters">
              <div className="filter-group">
                <label>Estado</label>
                <select 
                  value={filters.status} 
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="Abierto">Abierto</option>
                  <option value="En Progreso">En Progreso</option>
                  <option value="Completado">Completado</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Prioridad</label>
                <select 
                  value={filters.priority} 
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                >
                  <option value="">Todas</option>
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Buscar</label>
                <input 
                  type="text" 
                  placeholder="Buscar tickets..." 
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
              {(filters.status || filters.priority || filters.search) && (
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setFilters({ status: '', priority: '', search: '' })}
                >
                  Limpiar Filtros
                </button>
              )}
            </div>
            
            {/* Tickets en horizontal con scroll */}
            <div className="tickets-horizontal-container">
              <TicketList 
                currentUser={currentUser} 
                filters={filters}
                showForm={showTicketForm}
                onFormClose={() => setShowTicketForm(false)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <Navbar
        currentUser={currentUser}
        onLoginClick={() => setShowLoginModal(true)}
        onRegisterClick={() => setShowRegisterModal(true)}
        onLogout={handleLogout}
      />
      
      {renderContent()}

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSuccess={handleRegisterSuccess}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  );
};

export default App;