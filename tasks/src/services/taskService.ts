export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  created_at: string;
  updated_at: string;
  user_id: string;
  isEditing?: boolean;
  isDeleting?: boolean;
}

export const taskService = {
  async getTasks() {
    const response = await fetch('/api/tasks');
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
  },

  async createTask(title: string, userId: string, description?: string) {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, user_id: userId, description }),
    });
    if (!response.ok) throw new Error('Failed to create task');
    return response.json();
  },

  async updateTask(id: string, updates: Partial<Task>) {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update task');
    return response.json();
  },

  async deleteTask(id: string) {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete task');
  },

  async toggleComplete(id: string) {
    const response = await fetch(`/api/tasks/${id}/complete`, {
      method: 'PATCH',
    });
    if (!response.ok) throw new Error('Failed to toggle task');
    return response.json();
  }
}; 