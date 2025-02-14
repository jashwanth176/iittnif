'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  HiPencil,
  HiTrash,
  HiCheck,
  HiXMark
} from 'react-icons/hi2';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  description?: string;
  isEditing?: boolean;
  isDeleting?: boolean;
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input when editing starts
    const editingTask = tasks.find(t => t.isEditing);
    if (editingTask && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [tasks]);

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, {
      id: crypto.randomUUID(),
      title: newTask.trim(),
      completed: false
    }]);
    setNewTask('');
  };

  const handleToggleComplete = (id: string) => {
    setTasks(prev => {
      // First, update the completed status
      const updatedTasks = prev.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      
      // Then sort with a slight delay to allow animation
      setTimeout(() => {
        setTasks(tasks => [...tasks].sort((a, b) => {
          if (a.completed === b.completed) return 0;
          return a.completed ? 1 : -1;
        }));
      }, 500); // Match this with the CSS animation duration

      return updatedTasks;
    });
  };

  const handleEdit = (id: string) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, isEditing: true } : task
    ));
  };

  const handleUpdate = (id: string, newTitle: string) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, title: newTitle.trim(), isEditing: false } : task
    ));
  };

  const handleDeleteConfirm = (id: string) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, isDeleting: true } : task
    ));
  };

  const handleDelete = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const handleCancelDelete = (id: string) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, isDeleting: false } : task
    ));
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white/20 backdrop-blur-[2px] rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg">
        <div className="space-y-4 sm:space-y-6">
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
              <div 
                key={task.id} 
                className={`task-item ${
                  task.isDeleting ? 'bg-destructive/5' : 'hover:bg-secondary/5'
                } ${task.completed ? 'task-completed' : ''}`}
              >
                {/* Completion Toggle Button */}
                <button 
                  className="p-2 hover:text-primary transition-all duration-300"
                  onClick={() => handleToggleComplete(task.id)}
                >
                  <HiCheck className={`w-6 h-6 transform transition-all duration-300 ${
                    task.completed 
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
                      className="input-primary"
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
                      task.completed 
                        ? 'line-through text-primary/50' 
                        : 'text-primary'
                    }`}>
                      {task.title}
                    </h3>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {task.isDeleting ? (
                    <>
                      <button 
                        onClick={() => handleDelete(task.id)}
                        className="btn-primary bg-destructive hover:bg-destructive/90 text-destructive-foreground whitespace-nowrap"
                      >
                        Confirm
                      </button>
                      <button 
                        onClick={() => handleCancelDelete(task.id)}
                        className="btn-icon"
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