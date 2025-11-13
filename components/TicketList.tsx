import React, { useState, useEffect, useCallback } from 'react';
import type { Ticket, User, TicketCreateData, TicketUpdateData, TicketSubmitData } from '../types';
import { ticketAPI, userAPI } from '../services/api';
import TicketCard from './TicketCard';
import TicketForm from './TicketForm';
import { useNotification } from '../services/useNotification';

interface TicketListProps {
  currentUser: User;
  filters: {
    status: string;
    priority: string;
    search: string;
  };
  showForm: boolean;
  onFormClose: () => void;
}

const TicketList: React.FC<TicketListProps> = ({ 
  currentUser, 
  filters, 
  showForm, 
  onFormClose 
}) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [assigningTicket, setAssigningTicket] = useState<Ticket | null>(null);
  const [, setTicketToDelete] = useState<{id: number, title: string} | null>(null);

  const loadTickets = useCallback(async () => {
    try {
      let response;
      if (currentUser.role.name === 'admin') {
        response = await ticketAPI.getAll();
      } else if (currentUser.role.name === 'tecnico') {
        response = await ticketAPI.getTechnicianTickets(currentUser.id);
      } else {
        response = await ticketAPI.getUserTickets(currentUser.id);
      }
      setTickets(response.data);
    } catch (error) {
      console.error('Error loading tickets:', error);
    }
  }, [currentUser]);

  const loadTechnicians = useCallback(async () => {
    try {
      const response = await userAPI.getTechnicians();
      setTechnicians(response.data);
    } catch (error) {
      console.error('Error loading technicians:', error);
    }
  }, []);

  useEffect(() => {
    loadTickets();
    if (currentUser.role.name === 'admin') {
      loadTechnicians();
    }
  }, [currentUser, loadTickets, loadTechnicians]);

  const { showNotification } = useNotification();

  const handleCreateTicket = async (ticketData: TicketSubmitData) => {
    try {
      const createData: TicketCreateData = {
        ...ticketData as TicketCreateData,
        usuario_id: currentUser.id
      };
      await ticketAPI.create(createData);
      loadTickets();
      onFormClose();
      showNotification('Ticket creado exitosamente', 'success');
    } catch (error) {
      console.error('Error creating ticket:', error);
      showNotification('Error al crear el ticket', 'error');
    }
  };

  const handleUpdateTicket = async (ticketData: TicketSubmitData) => {
    if (!editingTicket) return;
    
    try {
      await ticketAPI.update(editingTicket.id, ticketData as TicketUpdateData);
      loadTickets();
      setEditingTicket(null);
      showNotification('Ticket actualizado exitosamente', 'success');
    } catch (error) {
      console.error('Error updating ticket:', error);
      showNotification('Error al actualizar el ticket', 'error');
    }
  };

  const handleAssignTicket = async (technicianId: string) => {
    if (!assigningTicket) return;
    
    try {
      await ticketAPI.assign(assigningTicket.id, {
        tecnico_id: parseInt(technicianId),
        admin_asignador_id: currentUser.id
      });
      loadTickets();
      setAssigningTicket(null);
      showNotification('Ticket asignado exitosamente', 'success');
    } catch (error) {
      console.error('Error assigning ticket:', error);
      showNotification('Error al asignar el ticket', 'error');
    }
  };

  const handleStatusChange = async (ticket: Ticket, newStatus: string) => {
    try {
      await ticketAPI.update(ticket.id, { estado: newStatus });
      loadTickets();
      showNotification(`Estado del ticket actualizado a ${newStatus}`, 'success');
    } catch (error) {
      console.error('Error updating ticket status:', error);
      showNotification('Error al actualizar el estado del ticket', 'error');
    }
  };

  const handleDeleteClick = (ticketId: number, ticketTitle: string) => {
    setTicketToDelete({ id: ticketId, title: ticketTitle });
  
    showNotification(
      `¿Eliminar ticket "${ticketTitle}"?`,
      'warning',
      {
        duration: 5000, // 5 segundos para confirmar
        action: {
          label: 'Eliminar',
          onClick: () => confirmDelete(ticketId)
        },
        onClose: () => setTicketToDelete(null)
      }
    );
  };

  const confirmDelete = async (ticketId: number) => {
    try {
      await ticketAPI.delete(ticketId);
      loadTickets();
      showNotification('Ticket eliminado exitosamente', 'success');
    } catch (error) {
      console.error('Error deleting ticket:', error);
      showNotification('Error al eliminar el ticket', 'error');
    } finally {
      setTicketToDelete(null);
    }
  };

  // Filtrar y ordenar tickets
  const filteredAndSortedTickets = tickets
    .filter(ticket => {
      if (filters.status && ticket.estado !== filters.status) return false;
      if (filters.priority && ticket.prioridad !== filters.priority) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          ticket.titulo.toLowerCase().includes(searchLower) ||
          (ticket.descripcion && ticket.descripcion.toLowerCase().includes(searchLower))
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (a.estado === 'Completado' && b.estado !== 'Completado') return 1;
      if (a.estado !== 'Completado' && b.estado === 'Completado') return -1;
      
      const priorityOrder = { alta: 1, media: 2, baja: 3 };
      return priorityOrder[a.prioridad] - priorityOrder[b.prioridad];
    });

  return (
    <>
      <div className="tickets-horizontal-list">
        {filteredAndSortedTickets.map(ticket => (
          <div key={ticket.id} className="ticket-card-horizontal">
            <TicketCard
              ticket={ticket}
              currentUser={currentUser}
              onEdit={setEditingTicket}
              onDelete={() => handleDeleteClick(ticket.id, ticket.titulo)}
              onAssign={setAssigningTicket}
              onStatusChange={handleStatusChange}
            />
          </div>
        ))}

        {filteredAndSortedTickets.length === 0 && (
          <div className="empty-state-horizontal">
            <p>No hay tickets para mostrar</p>
            {filters.status || filters.priority || filters.search ? (
              <p>Intenta con otros filtros</p>
            ) : null}
          </div>
        )}
      </div>

      {/* Modales */}
      {showForm && (
        <TicketForm
          onSubmit={handleCreateTicket}
          onCancel={onFormClose}
          currentUser={currentUser}
          technicians={technicians}
        />
      )}

      {editingTicket && (
        <TicketForm
          ticket={editingTicket}
          onSubmit={handleUpdateTicket}
          onCancel={() => setEditingTicket(null)}
          currentUser={currentUser}
          technicians={technicians}
        />
      )}

      {assigningTicket && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Asignar Técnico</h3>
              <button onClick={() => setAssigningTicket(null)} className="close-btn">
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>Selecciona un técnico para el ticket: <strong>{assigningTicket.titulo}</strong></p>
              <select
                onChange={(e) => handleAssignTicket(e.target.value)}
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
          </div>
        </div>
      )}
    </>
  );
};

export default TicketList;