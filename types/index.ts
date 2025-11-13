import type { ReactNode } from "react";
import type { ToastType } from "../components/Toast";

export interface User {
  id: number;
  dni: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  departamento: string;
  correo: string;
  role: Role;
}

export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface Ticket {
  id: number;
  titulo: string;
  descripcion: string;
  prioridad: 'alta' | 'media' | 'baja';
  estado: string;
  fecha_creacion: string;
  fecha_modificacion: string;
  fecha_completado: string | null;
  usuario: User;
  tecnico: User | null;
  admin_asignador: User | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Interfaces para formularios
export interface RegisterData {
  dni: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  departamento: string;
  correo: string;
  password: string;
}

export interface UserCreateData {
  dni: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  departamento: string;
  correo: string;
  password: string;
  role_id: number;
}

export interface UserUpdateData {
  dni?: string;
  nombres?: string;
  apellidos?: string;
  telefono?: string;
  departamento?: string;
  correo?: string;
  role_id?: number;
}

export interface TicketCreateData {
  titulo: string;
  descripcion: string;
  prioridad: 'alta' | 'media' | 'baja';
  usuario_id: number;
  tecnico_id?: number;
}

export interface TicketUpdateData {
  titulo?: string;
  descripcion?: string;
  prioridad?: 'alta' | 'media' | 'baja';
  estado?: string;
  tecnico_id?: number;
}

export interface TicketAssignData {
  tecnico_id: number;
  admin_asignador_id: number;
}

export interface TicketFormState {
  titulo: string;
  descripcion: string;
  prioridad: 'alta' | 'media' | 'baja';
  tecnico_id: string | number;
  usuario_id: number;
}

export interface Notification {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export interface NotificationContextType {
  showNotification: (message: string, type: ToastType, duration?: number) => void;
  hideNotification: (id: string) => void;
}

export interface NotificationProviderProps {
  children: ReactNode;
}

export type TicketSubmitData = TicketCreateData | TicketUpdateData;