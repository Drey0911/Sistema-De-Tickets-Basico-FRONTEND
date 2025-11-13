import React from 'react';
import type { Ticket, User } from '../types';

interface TicketCardProps {
  ticket: Ticket;
  currentUser: User;
  onEdit?: (ticket: Ticket) => void;
  onDelete?: (ticketId: number) => void;
  onAssign?: (ticket: Ticket) => void;
  onStatusChange?: (ticket: Ticket, newStatus: string) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ 
  ticket, 
  currentUser, 
  onEdit, 
  onDelete, 
  onAssign,
  onStatusChange 
}) => {
  const getPriorityColor = (prioridad: string) => {
    switch (prioridad) {
      case 'alta': return '#ff4444';
      case 'media': return '#ffaa00';
      case 'baja': return '#00aa00';
      default: return '#666';
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'Completado': return '#00aa00';
      case 'En Progreso': return '#ffaa00';
      case 'Abierto': return '#4444ff';
      default: return '#666';
    }
  };

  const canEdit = currentUser.role.name === 'admin' || 
                 currentUser.id === ticket.usuario.id 

  const canDelete = currentUser.role.name === 'admin' || 
                   currentUser.id === ticket.usuario.id;

  const isAdmin = currentUser.role.name === 'admin';
  const isTechnician = currentUser.role.name === 'tecnico';

  return (
    <div className="ticket-card">
      <div className="ticket-header">
        <h4>{ticket.titulo}</h4>
        <div className="ticket-meta">
          <span 
            className="priority-badge"
            style={{ backgroundColor: getPriorityColor(ticket.prioridad) }}
          >
            {ticket.prioridad}
          </span>
          <span 
            className="status-badge"
            style={{ backgroundColor: getStatusColor(ticket.estado) }}
          >
            {ticket.estado}
          </span>
        </div>
      </div>
      
      <div className="ticket-body">
        <p>{ticket.descripcion}</p>
        
        <div className="ticket-info">
          <div className="info-item">
            <strong>Creado por:</strong> {ticket.usuario.nombres} {ticket.usuario.apellidos}
          </div>
          {ticket.tecnico && (
            <div className="info-item">
              <strong>Técnico:</strong> {ticket.tecnico.nombres} {ticket.tecnico.apellidos}
            </div>
          )}
          <div className="info-item">
            <strong>Fecha:</strong> {new Date(ticket.fecha_creacion).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="ticket-actions">
        {isAdmin && !ticket.tecnico && (
          <button 
            onClick={() => onAssign?.(ticket)}
            className="btn btn-sm btn-primary"
          >
            Asignar Técnico
          </button>
        )}
        
        {isTechnician && ticket.estado !== 'Completado' && (
          <select
            value={ticket.estado}
            onChange={(e) => onStatusChange?.(ticket, e.target.value)}
            className="status-select"
          >
            <option value="Abierto">Abierto</option>
            <option value="En Progreso">En Progreso</option>
            <option value="Completado">Completado</option>
          </select>
        )}
        
        {canEdit && (
          <button 
            onClick={() => onEdit?.(ticket)}
            className="btn btn-sm btn-secondary"
          >
            Editar
          </button>
        )}
        
        {canDelete && (
          <button 
            onClick={() => onDelete?.(ticket.id)}
            className="btn btn-sm btn-danger"
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
};

export default TicketCard;