import axios from 'axios';
import type { AuthResponse, Ticket, User} from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interfaces para los datos de los formularios
interface RegisterData {
  dni: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  departamento: string;
  correo: string;
  password: string;
}

interface UserCreateData {
  dni: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  departamento: string;
  correo: string;
  password: string;
  role_id: number;
}

interface UserUpdateData {
  nombres?: string;
  apellidos?: string;
  telefono?: string;
  departamento?: string;
  role_id?: number;
}

interface TicketCreateData {
  titulo: string;
  descripcion: string;
  prioridad: 'alta' | 'media' | 'baja';
  usuario_id: number;
}

interface TicketUpdateData {
  titulo?: string;
  descripcion?: string;
  prioridad?: 'alta' | 'media' | 'baja';
  estado?: string;
}

interface TicketAssignData {
  tecnico_id: number;
  admin_asignador_id: number;
}

export const authAPI = {
  login: (correo: string, password: string) => 
    api.post<AuthResponse>('/auth/login', { correo, password }),
  
  register: (userData: RegisterData) => 
    api.post<{ message: string; user: User }>('/auth/register', userData),
};

export const userAPI = {
  getAll: () => api.get<User[]>('/users'),
  getById: (id: number) => api.get<User>(`/users/${id}`),
  create: (userData: UserCreateData) => 
    api.post<{ message: string; user: User }>('/users', userData),
  update: (id: number, userData: UserUpdateData) => 
    api.put<{ message: string; user: User }>(`/users/${id}`, userData),
  delete: (id: number) => 
    api.delete<{ message: string }>(`/users/${id}`),
  getTechnicians: () => api.get<User[]>('/users/technicians'),
};

export const ticketAPI = {
  getAll: () => api.get<Ticket[]>('/tickets'),
  getUserTickets: (userId: number) => api.get<Ticket[]>(`/tickets/user/${userId}`),
  getTechnicianTickets: (technicianId: number) => 
    api.get<Ticket[]>(`/tickets/technician/${technicianId}`),
  create: (ticketData: TicketCreateData) => 
    api.post<{ message: string; ticket: Ticket }>('/tickets', ticketData),
  update: (id: number, ticketData: TicketUpdateData) => 
    api.put<{ message: string; ticket: Ticket }>(`/tickets/${id}`, ticketData),
  assign: (id: number, assignmentData: TicketAssignData) => 
    api.put<{ message: string; ticket: Ticket }>(`/tickets/${id}/assign`, assignmentData),
  delete: (id: number) => 
    api.delete<{ message: string }>(`/tickets/${id}`),
};

export default api;