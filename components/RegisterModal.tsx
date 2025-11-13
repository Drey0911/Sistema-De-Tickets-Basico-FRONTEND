import React, { useState } from 'react';
import { authAPI } from '../services/api';
import axios, { AxiosError } from 'axios';
import { useNotification } from '../services/useNotification';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    dni: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    departamento: '',
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
          case 400:
            return 'Datos inválidos. Verifica la información';
          case 409:
            return 'El correo o DNI ya están registrados';
          case 422:
            return 'Por favor completa todos los campos correctamente';
          case 500:
            return 'Error en el servidor. Intenta más tarde';
          default:
            return 'Error al registrar. Verifica tus datos';
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
      await authAPI.register(formData);
      showNotification('Registro exitoso', 'success');
      onSuccess();
      onClose();
      setFormData({
        dni: '',
        nombres: '',
        apellidos: '',
        telefono: '',
        departamento: '',
        correo: '',
        password: ''
      });
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
          <h3>Registrarse</h3>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit} id="register-form">

            
            <div className="form-row">
              <div className="form-group">
                <label>DNI:</label>
                <input
                  type="text"
                  value={formData.dni}
                  onChange={(e) => setFormData({...formData, dni: e.target.value})}
                  required
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Teléfono:</label>
                <input
                  type="text"
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  required
                  className="form-input"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Nombres:</label>
                <input
                  type="text"
                  value={formData.nombres}
                  onChange={(e) => setFormData({...formData, nombres: e.target.value})}
                  required
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Apellidos:</label>
                <input
                  type="text"
                  value={formData.apellidos}
                  onChange={(e) => setFormData({...formData, apellidos: e.target.value})}
                  required
                  className="form-input"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Departamento:</label>
              <input
                type="text"
                value={formData.departamento}
                onChange={(e) => setFormData({...formData, departamento: e.target.value})}
                required
                className="form-input"
              />
            </div>
            
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
                minLength={6}
                className="form-input"
              />
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button 
            type="submit" 
            form="register-form"
            disabled={loading} 
            className="btn btn-primary"
          >
            {loading ? 'Registrando...' : 'Registrarse'}
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

export default RegisterModal;