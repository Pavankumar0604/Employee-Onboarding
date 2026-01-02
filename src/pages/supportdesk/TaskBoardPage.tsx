import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@store/AuthContext';
import type { Task } from '../../types/task';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '@components/layout/LoadingSpinner';
import PageHeader from '../../components/layout/PageHeader';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'; // Assuming this library is available - INSTALL IT!

const TaskBoardPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const userId = user?.id;

  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const fetchedTasks = await api.getTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!authLoading && userId) {
      fetchTasks();
    }
  }, [authLoading, userId, fetchTasks]);


  const navigate = useNavigate();

  const handleTaskClick = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };

  if (authLoading || loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4 bg-red-50 border border-red-300 rounded-lg">{error}</div>;
  }

  const openTasks = tasks?.filter(task => task.status === 'Pending') || [];
  const inProgressTasks = tasks?.filter(task => task.status === 'In Progress') || [];
  const completedTasks = tasks?.filter(task => task.status === 'Completed') || [];

  return (
    <div className="p-6 space-y-4">
      <PageHeader
        title="Support Desk"
        subtitle="Kanban board for support tickets and task tracking"
      />

      <div className="flex">
        <div className="w-1/3 p-4">
          <h2 className="text-heading-m text-primary-text mb-2">Open</h2>
          {/* Droppable Area - Open */}
          <div>
            {openTasks.map(task => (
              <div key={task.id} className="p-4 bg-white rounded-lg shadow-md border border-primary-border mb-4 cursor-pointer" onClick={() => handleTaskClick(task.id)}>
                <h3 className="text-heading-s font-medium text-primary-text">{task.title}</h3>
                <p className="text-body-small text-primary-text/70">{task.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-1/3 p-4">
          <h2 className="text-heading-m text-primary-text mb-2">In Progress</h2>
          {/* Droppable Area - In Progress */}
          <div>
            {inProgressTasks.map(task => (
              <div key={task.id} className="p-4 bg-white rounded-lg shadow-md border border-primary-border mb-4 cursor-pointer" onClick={() => handleTaskClick(task.id)}>
                <h3 className="text-lg font-medium text-primary-text">{task.title}</h3>
                <p className="text-sm text-primary-text/70">{task.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-1/3 p-4">
          <h2 className="text-heading-m text-primary-text mb-2">Completed</h2>
          {/* Droppable Area - Completed */}
          <div>
            {completedTasks.map(task => (
              <div key={task.id} className="p-4 bg-white rounded-lg shadow-md border border-primary-border mb-4 cursor-pointer" onClick={() => handleTaskClick(task.id)}>
                <h3 className="text-lg font-medium text-primary-text">{task.title}</h3>
                <p className="text-sm text-primary-text/70">{task.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default TaskBoardPage;