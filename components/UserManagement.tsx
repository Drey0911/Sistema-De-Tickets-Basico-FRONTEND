import React, { useState, useEffect } from 'react';
import type { User, Role, UserCreateData, UserUpdateData } from '../types';
import { userAPI } from '../services/api';
import { useNotification } from '../services/useNotification';

interface UserManagementProps {
  currentUser: User;
}

const UserManagement: React.FC<UserManagementProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    dni: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    departamento: '',
    correo: '',
    password: '',
    role_id: ''
  });

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await userAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadRoles = async () => {
    const defaultRoles: Role[] = [
      { id: 1, name: 'admin', description: 'Administrador' },
      { id: 2, name: 'tecnico', description: 'Técnico' },
      { id: 3, name: 'usuario', description: 'Usuario' }
    ];
    setRoles(defaultRoles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const roleId = parseInt(formData.role_id);

      if (editingUser) {
        // crear objeto solo con los campos que existen
        const updateData: UserUpdateData = {};
        
        if (formData.dni) updateData.dni = formData.dni;
        if (formData.nombres) updateData.nombres = formData.nombres;
        if (formData.apellidos) updateData.apellidos = formData.apellidos;
        if (formData.telefono) updateData.telefono = formData.telefono;
        if (formData.departamento) updateData.departamento = formData.departamento;
        if (formData.correo) updateData.correo = formData.correo;
        if (roleId) updateData.role_id = roleId;

        await userAPI.update(editingUser.id, updateData);
        showNotification('Usuario actualizado exitosamente', 'success');
      } else {
        // enviar todos los datos para creacion 
        const createData: UserCreateData = {
          dni: formData.dni,
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          telefono: formData.telefono,
          departamento: formData.departamento,
          correo: formData.correo,
          password: formData.password,
          role_id: roleId
        };
        await userAPI.create(createData);
        showNotification('Usuario creado exitosamente', 'success');
      }
      loadUsers();
      resetForm();
    } catch (error) {
      console.error('Error saving user:', error);
      showNotification('Error al guardar el usuario', 'error');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      dni: user.dni,
      nombres: user.nombres,
      apellidos: user.apellidos,
      telefono: user.telefono,
      departamento: user.departamento,
      correo: user.correo,
      password: '',
      role_id: user.role.id.toString()
    });
    setShowForm(true);
  };

  const handleDeleteClick = (userId: number, userName: string) => {
    showNotification(
      `¿Eliminar usuario "${userName}"?`,
      'warning',
      {
        duration: 5000,
        action: {
          label: 'Eliminar',
          onClick: () => confirmDelete(userId)
        }
      }
    );
  };

  const confirmDelete = async (userId: number) => {
    try {
      await userAPI.delete(userId);
      loadUsers();
      showNotification('Usuario eliminado exitosamente', 'success');
    } catch (error) {
      console.error('Error deleting user:', error);
      showNotification('Error al eliminar el usuario', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      dni: '',
      nombres: '',
      apellidos: '',
      telefono: '',
      departamento: '',
      correo: '',
      password: '',
      role_id: ''
    });
    setEditingUser(null);
    setShowForm(false);
  };

  // Verificar si el usuario actual puede realizar acciones
  const canManageUsers = currentUser.role.name === 'admin';

  if (!canManageUsers) {
    return (
      <div className="user-management">
        <div className="error-message">
          No tienes permisos para acceder a la gestión de usuarios.
        </div>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="section-header">
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          Nuevo Usuario
        </button>
      </div>

      {showForm && (
        <div className="form-section">
          <h3>{editingUser ? 'Editar Usuario' : 'Crear Usuario'}</h3>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-row">
              <div className="form-group">
                <label>DNI:</label>
                <input
                  type="text"
                  value={formData.dni}
                  onChange={(e) => setFormData({...formData, dni: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Rol:</label>
                <select
                  value={formData.role_id}
                  onChange={(e) => setFormData({...formData, role_id: e.target.value})}
                  required
                >
                  <option value="">Seleccionar Rol</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
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
                />
              </div>
              <div className="form-group">
                <label>Apellidos:</label>
                <input
                  type="text"
                  value={formData.apellidos}
                  onChange={(e) => setFormData({...formData, apellidos: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Teléfono:</label>
                <input
                  type="text"
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Departamento:</label>
                <input
                  type="text"
                  value={formData.departamento}
                  onChange={(e) => setFormData({...formData, departamento: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Correo:</label>
              <input
                type="email"
                value={formData.correo}
                onChange={(e) => setFormData({...formData, correo: e.target.value})}
                required
              />
            </div>

            {!editingUser && (
              <div className="form-group">
                <label>Contraseña:</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required={!editingUser}
                />
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingUser ? 'Actualizar' : 'Crear'}
              </button>
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="users-list">
        <h3>Lista de Usuarios</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>DNI</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.dni}</td>
                  <td>{user.nombres} {user.apellidos}</td>
                  <td>{user.correo}</td>
                  <td>{user.telefono}</td>
                  <td>{user.role.name}</td>
                  <td>
                    <button 
                      onClick={() => handleEdit(user)}
                      className="btn btn-sm btn-primary"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(user.id, `${user.nombres} ${user.apellidos}`)}
                      className="btn btn-sm btn-danger"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;