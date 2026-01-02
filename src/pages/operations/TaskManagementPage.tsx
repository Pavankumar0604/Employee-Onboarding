// src/pages/operations/TaskManagementPage.tsx
import React, { useState } from 'react';
import TaskForm from '../../components/tasks/TaskForm';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Toast from '../../components/ui/Toast';
import PageHeader from '../../components/layout/PageHeader';
import type { Task, TaskPriority, MindmeshUser as User } from '../../types/mindmesh'; // Use Task from mindmesh.d.ts
import { format } from 'date-fns';

// Local Mock Data (aligned with mindmesh.d.ts Task structure)
const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alice Johnson', email: 'alice@example.com', full_name: 'Alice Johnson', role: 'admin', organizationId: null, organizationName: null, is_active: true, created_at: new Date().toISOString(), phone_number: null, photo_url: 'https://i.pravatar.cc/150?img=1' },
  { id: 'u2', name: 'Bob Smith', email: 'bob@example.com', full_name: 'Bob Smith', role: 'site_manager', organizationId: null, organizationName: null, is_active: true, created_at: new Date().toISOString(), phone_number: null, photo_url: 'https://i.pravatar.cc/150?img=2' },
  { id: 'u3', name: 'Charlie Brown', email: 'charlie@example.com', full_name: 'Charlie Brown', role: 'field_officer', organizationId: null, organizationName: null, is_active: true, created_at: new Date().toISOString(), phone_number: null, photo_url: 'https://i.pravatar.cc/150?img=3' },
];

const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    name: 'Review Q3 Financial Reports',
    description: 'Analyze and finalize the quarterly financial reports for submission to the board.',
    priority: 'High',
    dueDate: format(new Date(2025, 10, 20), 'yyyy-MM-dd'), // Nov 20
    assignedToId: MOCK_USERS[0].id,
    assignedToName: MOCK_USERS[0].name,
    status: 'in_progress',
    escalationStatus: 'level1',
    createdAt: new Date(2025, 10, 1).toISOString(),
  },
  {
    id: 't2',
    name: 'Update Employee Handbook',
    description: 'Incorporate new HR policies regarding remote work and benefits.',
    priority: 'Medium',
    dueDate: format(new Date(2025, 10, 15), 'yyyy-MM-dd'), // Nov 15 (Overdue)
    assignedToId: MOCK_USERS[1].id,
    assignedToName: MOCK_USERS[1].name,
    status: 'overdue',
    escalationStatus: 'level2',
    createdAt: new Date(2025, 9, 25).toISOString(),
  },
  {
    id: 't3',
    name: 'Setup new server infrastructure',
    description: 'Configure AWS instances for the new project deployment.',
    priority: 'High',
    dueDate: format(new Date(2025, 10, 25), 'yyyy-MM-dd'), // Nov 25
    assignedToId: MOCK_USERS[2].id,
    assignedToName: MOCK_USERS[2].name,
    status: 'pending',
    escalationStatus: 'none',
    createdAt: new Date(2025, 10, 10).toISOString(),
  },
  {
    id: 't4',
    name: 'Onboard new security staff',
    description: 'Complete background checks and issue uniforms for 5 new security personnel.',
    priority: 'Low',
    dueDate: format(new Date(2025, 10, 18), 'yyyy-MM-dd'), // Nov 18
    assignedToId: MOCK_USERS[0].id,
    assignedToName: MOCK_USERS[0].name,
    status: 'completed',
    escalationStatus: 'none',
    createdAt: new Date(2025, 10, 5).toISOString(),
  },
];

const getStatusColor = (status: Task['status']) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'in_progress': return 'bg-blue-100 text-blue-800';
    case 'completed': return 'bg-sky-100 text-sky-800';
    case 'overdue': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case 'High': return 'text-red-600 font-bold';
    case 'Medium': return 'text-yellow-600';
    case 'Low': return 'text-sky-700';
    default: return 'text-gray-600';
  }
};

const getEscalationColor = (escalation: Task['escalationStatus']) => {
  switch (escalation) {
    case 'level1': return 'text-orange-600 font-semibold';
    case 'level2': return 'text-red-700 font-bold';
    case 'email_sent': return 'text-red-900 font-extrabold';
    default: return 'text-gray-500';
  }
};

const TaskManagementPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [filterStatus, setFilterStatus] = useState<Task['status'] | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all');
  const [filterAssignee, setFilterAssignee] = useState<string | 'all'>('all'); // User ID or 'all'

  const handleOpenModal = (task: Task | null = null) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const filteredTasks = MOCK_TASKS.filter(task => {
    if (filterStatus !== 'all' && task.status !== filterStatus) {
      return false;
    }
    if (filterPriority !== 'all' && task.priority !== filterPriority) {
      return false;
    }
    if (filterAssignee !== 'all' && task.assignedToId !== filterAssignee) {
      return false;
    }
    return true;
  });

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl min-h-screen">
      <PageHeader
        title="Task Management"
        subtitle="Manage and track operational tasks across your organization"
        secondaryActions={
          <>
            <Select
              label="Status"
              options={[
                { label: 'All Statuses', value: 'all' },
                { label: 'Pending', value: 'pending' },
                { label: 'In Progress', value: 'in_progress' },
                { label: 'Completed', value: 'completed' },
                { label: 'Overdue', value: 'overdue' },
              ]}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as Task['status'] | 'all')}
              className="w-48"
            />
            <Select
              label="Priority"
              options={[
                { label: 'All Priorities', value: 'all' },
                { label: 'High', value: 'High' },
                { label: 'Medium', value: 'Medium' },
                { label: 'Low', value: 'Low' },
              ]}
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as TaskPriority | 'all')}
              className="w-48"
            />
            <Select
              label="Assignee"
              options={[
                { label: 'All Users', value: 'all' },
                ...MOCK_USERS.map(user => ({ label: user.name, value: user.id })),
              ]}
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
              className="w-48"
            />
          </>
        }
        primaryAction={
          <Button
            onClick={() => handleOpenModal(null)}
            className="font-semibold py-2 px-6 rounded-lg flex items-center shadow-lg transition duration-150 ease-in-out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create New Task
          </Button>
        }
      />


      {/* Task List Header */}
      <div className="grid grid-cols-8 gap-4 py-3 border-b-2 border-indigo-200 text-sm font-bold uppercase text-gray-600 bg-indigo-50/50 rounded-t-lg px-4">
        <div className="col-span-2">Task Name</div>
        <div>Priority</div>
        <div>Due Date</div>
        <div>Assigned To</div>
        <div>Status</div>
        <div>Escalation</div>
        <div>Actions</div>
      </div>

      {/* Task List */}
      <div className="divide-y divide-gray-100">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <div key={task.id} className="grid grid-cols-8 gap-4 py-4 hover:bg-gray-50 transition duration-100 items-center px-4">
              <div className="col-span-2 font-medium text-gray-800 truncate">{task.name}</div>
              <div className={`text-xs font-semibold ${getPriorityColor(task.priority)}`}>{task.priority}</div>
              <div className="text-sm text-gray-600">
                {task.dueDate ? format(new Date(task.dueDate), 'MMM dd, yyyy') : 'N/A'}
              </div>
              <div className="text-sm text-gray-600">{task.assignedToName || 'Unassigned'}</div>
              <div>
                <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(task.status)}`}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>
              <div>
                <span className={`text-xs font-semibold capitalize ${getEscalationColor(task.escalationStatus || 'none')}`}>
                  {task.escalationStatus?.replace('_', ' ') || 'None'}
                </span>
              </div>
              <div>
                <Button
                  onClick={() => handleOpenModal(task)}
                  className="text-indigo-600 hover:text-indigo-800 p-1 text-sm font-medium"
                  variant="ghost"
                >
                  View/Edit
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center py-12 text-gray-500">
            No tasks found matching your criteria.
          </div>
        )}
      </div>

      <TaskForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={editingTask}
        setToast={setToast}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default TaskManagementPage;