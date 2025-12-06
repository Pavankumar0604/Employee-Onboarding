import { create } from 'zustand';
import type { Task } from '../types/mindmesh'; // Assuming Task is defined in mindmesh.d.ts

interface TaskStore {
  tasks: Task[];
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'status' | 'escalationStatus'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  // Add other task-related state and actions as needed
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  createTask: async (newTaskData) => {
    // Simulate API call
    // Creating task
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending', // Default status
      escalationStatus: 'none', // Default escalation status
    };
    set((state) => ({ tasks: [...state.tasks, newTask] }));
    // In a real application, you would make an API call here
    // await api.createTask(newTaskData);
  },
  updateTask: async (id, updatedTaskData) => {
    // Simulate API call
    // Updating task
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updatedTaskData } : task
      ),
    }));
    // In a real application, you would make an API call here
    // await api.updateTask(id, updatedTaskData);
  },
}));