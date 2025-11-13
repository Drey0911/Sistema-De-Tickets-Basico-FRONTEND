import React, { useState } from 'react';
import type { Ticket, TicketSubmitData, TicketFormState, TicketCreateData, User } from '../types';

interface TicketFormProps {
  ticket?: Ticket;
  onSubmit: (ticketData: TicketSubmitData) => void;
  onCancel: () => void;
  currentUser: User;
  technicians?: User[];
}

const TicketForm: React.FC<TicketFormProps> = ({ 
  ticket, 
  onSubmit, 
  onCancel, 
  currentUser,
  technicians = [] 
}) => {
  const [formData, setFormData] = useState<TicketFormState>({
    titulo: ticket?.titulo || '',
    descripcion: ticket?.descripcion || '',
    prioridad: ticket?.prioridad || 'media',
    tecnico_id: ticket?.tecnico?.id || '',
    usuario_id: ticket?.usuario?.id || currentUser.id
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData: TicketSubmitData = {
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      prioridad: formData.prioridad,
    };

    if (formData.tecnico_id) {
      submitData.tecnico_id = Number(formData.tecnico_id);
    }

    if (!ticket) {
      (submitData as TicketCreateData).usuario_id = formData.usuario_id;
    }

    onSubmit(submitData);
  };

  const handlePrioridadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const prioridad = e.target.value as 'alta' | 'media' | 'baja';
    setFormData({ ...formData, prioridad });
  };

  const handleTecnicoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, tecnico_id: e.target.value });
  };

  const isAdmin = currentUser.role.name === 'admin';

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{ticket ? 'Editar Ticket' : 'Nuevo Ticket'}</h3>
          <button onClick={onCancel} className="close-btn">
            &times;
          </button>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit} id="ticket-form">
            <div className="form-group">
              <label>Título:</label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Descripción:</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                required
                rows={4}
                className="form-textarea"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Prioridad:</label>
                <select
                  value={formData.prioridad}
                  onChange={handlePrioridadChange}
                  className="form-select"
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
              </div>

              {isAdmin && technicians.length > 0 && (
                <div className="form-group">
                  <label>Asignar a Técnico:</label>
                  <select
                    value={formData.tecnico_id}
                    onChange={handleTecnicoChange}
                    className="form-select"
                  >
                    <option value="">Seleccionar Técnico</option>
                    {technicians.map(tech => (
                      <option key={tech.id} value={tech.id}>
                        {tech.nombres} {tech.apellidos}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button type="submit" form="ticket-form" className="btn btn-primary">
            {ticket ? 'Actualizar' : 'Crear'} Ticket
          </button>
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketForm;