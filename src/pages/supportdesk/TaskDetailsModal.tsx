import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Task, UpdateTaskData } from '../../types/task';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/layout/LoadingSpinner';

const TaskDetailsModal: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();

  const onClose = () => {
    navigate(-1); // Go back to the previous page
  };
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');

  useEffect(() => {
    if (!taskId) {
      setError("Task ID is missing.");
      setLoading(false);
      return;
    }

    const fetchTaskDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedTask = await api.getTask(taskId);
        setTask(fetchedTask);
        if (fetchedTask) {
          setEditedTitle(fetchedTask.title);
          setEditedDescription(fetchedTask.description);
        }
      } catch (err) {
        console.error("Error fetching task details:", err);
        setError("Failed to load task details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  const handleSave = async () => {
    if (!task) return;
    setLoading(true);
    try {
      const updateData: UpdateTaskData = { title: editedTitle, description: editedDescription };
      await api.updateTask(task.id, updateData);
      setTask({ ...task, title: editedTitle, description: editedDescription });
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating task:", err);
      setError("Failed to update task.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
          <div className="text-center text-red-500 p-4 bg-red-50 border border-red-300 rounded-lg">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-heading-m font-semibold text-primary-text">Task Details</h2>
          <button onClick={onClose} className="p-2 text-gray-600 hover:text-gray-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {task && (
          <div className="space-y-4">
            {isEditing ? (
              <>
                <Input label="Title" value={editedTitle} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedTitle(e.target.value)} />
                <label className="block text-body-small font-medium text-primary-text">Description</label>
                <textarea
                  className="shadow-sm focus:ring-cta focus:border-cta block w-full sm:text-sm border-gray-300 rounded-md"
                  value={editedDescription}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditedDescription(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button onClick={handleSave} className="bg-cta hover:bg-hover-focus text-white px-4 py-2">Save</Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-primary-text"><strong>Title:</strong> {task.title}</p>
                <p className="text-primary-text"><strong>Description:</strong> {task.description}</p>
                <p className="text-primary-text"><strong>Status:</strong> {task.status}</p>

                {/* Placeholder for Escalation Workflow */}
                <div className="border-t border-primary-border pt-4">
                  <h4 className="text-heading-s font-medium text-primary-text">Escalation Workflow</h4>
                  <p className="text-body-small text-primary-text/70">[Escalation rules and actions would be displayed here]</p>
                </div>

                {/* Placeholder for Real-time Notifications */}
                <div className="border-t border-primary-border pt-4">
                  <h4 className="text-heading-s font-medium text-primary-text">Real-time Notifications</h4>
                  <p className="text-body-small text-primary-text/70">[Real-time notifications related to this task would appear here]</p>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-body-small text-primary-text/70">Assigned to: [User Name]</p>
                    <p className="text-body-small text-primary-text/70">Due Date: [Due Date]</p>
                  </div>
                  <Button onClick={() => setIsEditing(true)} className="bg-cta hover:bg-hover-focus text-white px-4 py-2">Edit</Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetailsModal;