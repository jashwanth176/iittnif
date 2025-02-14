import { supabase } from '@/lib/supabase';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  created_at: string;
  updated_at: string;
  user_id: string;
  // UI state properties
  isEditing?: boolean;
  isDeleting?: boolean;
}

export const taskService = {
  async getTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Task[];
  },

  async createTask(title: string, userId: string, description?: string) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ 
          title, 
          user_id: userId,
          description,
          status: 'pending'
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
      }
      
      if (!data) {
        throw new Error('No data returned from Supabase');
      }
      
      return data as Task;
    } catch (err) {
      console.error('Create task error:', err);
      throw err;
    }
  },

  async updateTask(id: string, updates: Partial<Task>) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Task;
  },

  async deleteTask(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async toggleComplete(id: string, completed: boolean) {
    const { data, error } = await supabase
      .from('tasks')
      .update({ status: completed ? 'completed' : 'pending' })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Task;
  }
}; 