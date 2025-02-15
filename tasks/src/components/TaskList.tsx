'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  HiPencil,
  HiTrash,
  HiCheck,
  HiXMark
} from 'react-icons/hi2';
import { taskService, Task } from '@/services/taskService';
import { useAuth } from '@/contexts/AuthContext';

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  // Fetch tasks on component mount
  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    try {
      if (!user) return;
      setLoading(true);
      const tasks = await taskService.getTasks();
      const filteredTasks = tasks
        .filter((task: Task) => task.user_id === user.uid)
        .sort((a: Task, b: Task) => {
          // Sort completed tasks to the end
          if (a.status === 'completed' && b.status !== 'completed') return 1;
          if (a.status !== 'completed' && b.status === 'completed') return -1;
          // For tasks with the same status, sort by creation date (newest first)
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
      setTasks(filteredTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.trim() || !user) return;
    
    try {
      setError(null); // Clear any previous errors
      const task = await taskService.createTask(newTask, user.uid);
      if (task) {
        setTasks(prev => [task, ...prev]);
        setNewTask('');
      }
    } catch (err) {
      console.error('Add task error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create task');
    }
  };

  const handleToggleComplete = async (id: string) => {
    try {
      const updatedTask = await taskService.toggleComplete(id);
      setTasks(prev => prev.map(task =>
        task.id === id ? { ...updatedTask, status: updatedTask.status } : task
      ).sort((a, b) => {
        if (a.status === b.status) return 0;
        return a.status === 'completed' ? 1 : -1;
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  const handleUpdate = async (id: string, title: string) => {
    try {
      const updatedTask = await taskService.updateTask(id, { title });
      setTasks(prev => prev.map(task =>
        task.id === id ? { ...updatedTask, isEditing: false } : task
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  const handleEdit = (id: string) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, isEditing: true } : task
    ));
    // Focus the input field after setting edit mode
    setTimeout(() => {
      editInputRef.current?.focus();
    }, 0);
  };

  const handleDeleteConfirm = (id: string) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, isDeleting: true } : task
    ));
  };

  const handleCancelDelete = (id: string) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, isDeleting: false } : task
    ));
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="bg-white/20 backdrop-blur-[2px] rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg">
        <div className="space-y-4 sm:space-y-6">
          {error && (
            <div className="text-destructive bg-destructive/10 p-4 rounded-lg">
              {error}
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">Tasks</h1>
          </div>

          {/* Add Task Input */}
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="What needs to be done?"
              className="input-primary"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddTask();
                }
              }}
            />
            <button
              onClick={handleAddTask}
              className="btn-primary w-full sm:w-auto justify-center"
            >
              Add Task
            </button>
          </div>

          {/* Task List */}
          <div className="divide-y divide-secondary/10">
            {tasks.map((task) => (
              <div key={task.id} className={`task-item ${task.status === 'completed' ? 'task-completed' : ''}`}>
                <button
                  onClick={() => handleToggleComplete(task.id)}
                  className="btn-icon"
                >
                  <HiCheck className={`w-5 h-5 transition-all duration-200 ${
                    task.status === 'completed'
                      ? 'text-primary scale-110 rotate-360' 
                      : 'text-primary/30 hover:text-primary/50'
                  }`} />
                </button>

                {/* Task Title */}
                <div className="flex-1">
                  {task.isEditing ? (
                    <input
                      ref={editInputRef}
                      type="text"
                      className="input-primary relative z-50 bg-white"
                      defaultValue={task.title}
                      onBlur={(e) => handleUpdate(task.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleUpdate(task.id, e.currentTarget.value);
                        }
                      }}
                    />
                  ) : (
                    <h3 className={`text-lg transform transition-all duration-300 ${
                      task.status === 'completed'
                        ? 'line-through text-primary/50' 
                        : 'text-primary'
                    }`}>
                      {task.title}
                    </h3>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {task.isDeleting ? (
                    <>
                      <button 
                        className="btn-icon text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(task.id)}
                      >
                        <HiCheck className="w-5 h-5" />
                      </button>
                      <button 
                        className="btn-icon"
                        onClick={() => handleCancelDelete(task.id)}
                      >
                        <HiXMark className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        className="btn-icon"
                        onClick={() => handleEdit(task.id)}
                      >
                        <HiPencil className="w-5 h-5" />
                      </button>
                      <button 
                        className="btn-icon text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteConfirm(task.id)}
                      >
                        <HiTrash className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 