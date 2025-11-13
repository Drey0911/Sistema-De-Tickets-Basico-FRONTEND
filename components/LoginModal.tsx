import React, { useState } from 'react';
import { authAPI } from '../services/api';
import type { User } from '../types';
import axios, { AxiosError } from 'axios';
import { useNotification } from '../services/useNotification';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string, user: User) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    correo: '',
    password: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const { showNotification } = useNotification();

  const getErrorMessage = (err: unknown): string => {
    // Si es un error de Axios
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError;
      
      if (axiosError.response) {
        const status = axiosError.response.status;
        
        switch (status) {
          case 401:
            return 'Correo o contraseña incorrectos';
          case 404:
            return 'Usuario no encontrado';
          case 500:
            return 'Error en el servidor. Intenta más tarde';
          case 403:
            return 'No tienes permiso para acceder';
          default:
            return 'Error al iniciar sesión. Verifica tus datos';
        }
      }
      
      // Si no hay conexión
      if (axiosError.message === 'Network Error') {
        return 'Sin conexión a internet. Verifica tu red';
      }
    }
    
    // Si es un error estándar de JavaScript
    if (err instanceof Error) {
      return err.message;
    }
    
    // Error genérico
    return 'Algo salió mal. Intenta nuevamente';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login(formData.correo, formData.password);
      showNotification('Inicio de sesión exitoso', 'success');
      onSuccess(response.data.token, response.data.user);
      onClose();
      setFormData({ correo: '', password: '' });
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Iniciar Sesión</h3>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit} id="login-form">
            <div className="form-group">
              <label>Correo Electrónico:</label>
              <input
                type="email"
                value={formData.correo}
                onChange={(e) => setFormData({...formData, correo: e.target.value})}
                required
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Contraseña:</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                className="form-input"
              />
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button 
            type="submit" 
            form="login-form"
            disabled={loading} 
            className="btn btn-primary"
          >
            {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
          </button>
          <button 
            type="button" 
            onClick={onClose} 
            className="btn btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;