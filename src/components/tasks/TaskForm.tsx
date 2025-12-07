import { useEffect, useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type { Task, TaskPriority, MindmeshUser as User } from '../../types/mindmesh';
import { useTaskStore } from '../../store/taskStore.ts';
import { api } from '../../services/api';
import Input from '../ui/Input';
import Select from './../ui/Select';
import Button from '../ui/Button';
import DatePicker from '../ui/DatePicker';

const validationSchema = yup.object({
  name: yup.string().required('Task name is required'),
  description: yup.string().optional(),
  dueDate: yup.string().optional().nullable(),
  priority: yup.string<TaskPriority>().oneOf<TaskPriority>(['Low', 'Medium', 'High']).required('Priority is required'),
  assignedToId: yup.string().optional(),
  escalationLevel1UserId: yup.string().optional(),
  escalationLevel1DurationDays: yup.number().when('escalationLevel1UserId', {
    is: (val: string | undefined) => !!val,
    then: (schema: yup.NumberSchema) => schema.required('Duration is required').min(0).typeError('Must be a number'), // Explicit type
    otherwise: (schema: yup.NumberSchema) => schema.optional().nullable(), // Explicit type
  }),
  escalationLevel2UserId: yup.string().optional(),
  escalationLevel2DurationDays: yup.number().when('escalationLevel2UserId', {
    is: (val: string | undefined) => !!val,
    then: (schema: yup.NumberSchema) => schema.required('Duration is required').min(0).typeError('Must be a number'), // Explicit type
    otherwise: (schema: yup.NumberSchema) => schema.optional().nullable(), // Explicit type
  }),
  escalationEmail: yup.string().email('Must be a valid email address').optional(),
  escalationEmailDurationDays: yup.number().when('escalationEmail', {
    is: (val: string | undefined) => !!val,
    then: (schema: yup.NumberSchema) => schema.required('Duration is required').min(0).typeError('Must be a number'), // Explicit type
    otherwise: (schema: yup.NumberSchema) => schema.optional().nullable(), // Explicit type
  }),
}).defined();

type TaskFormInputs = Omit<Task, 'id' | 'createdAt' | 'status' | 'assignedToName' | 'completionNotes' | 'completionPhoto'>;

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: Task | null;
  setToast: (toast: { message: string; type: 'success' | 'error' } | null) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ isOpen, onClose, initialData, setToast }) => {
  const { createTask, updateTask } = useTaskStore();
  const [isSaving, setIsSaving] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const { register, handleSubmit, formState: { errors }, reset, control, watch } = useForm<TaskFormInputs>({
    resolver: yupResolver(validationSchema) as any,
  });

  const isEditing = !!initialData;
  const watchEscalationL1User = watch("escalationLevel1UserId");
  const watchEscalationL2User = watch("escalationLevel2UserId");
  const watchEscalationEmail = watch("escalationEmail");

  useEffect(() => {
    if (isOpen) {
      api.getAllUsersWithRoles().then((users: any) => {
        if (users) {
          const mindmeshUsers: User[] = users.map((user: any) => ({
            id: user.id,
            email: user.email || '',
            full_name: user.full_name,
            name: user.full_name || user.email || 'Unknown User',
            role: user.roles?.[0]?.name || 'field_officer',
            organizationId: null,
            organizationName: null,
            is_active: user.is_active,
            created_at: user.created_at,
            phone_number: null,
            photo_url: null,
          }));
          setUsers(mindmeshUsers);
        }
      }).catch((error: Error) => {
        console.error("Failed to fetch users:", error);
        setUsers([]);
      });
      if (initialData) {
        reset(initialData);
      } else {
        reset({ name: '', description: '', dueDate: null, priority: 'Medium', assignedToId: '', escalationLevel1UserId: '', escalationLevel2UserId: '', escalationEmail: '' }); // Added escalation fields
      }
    }
  }, [initialData, reset, isOpen]);

  const onSubmit: SubmitHandler<TaskFormInputs> = async (formData) => { // FIX 4: Define onSubmit correctly
    try {
      setIsSaving(true);
      const assignedUser = users.find(u => u.id === formData.assignedToId);
      const taskData = { ...formData, assignedToName: assignedUser?.name };

      if (isEditing) {
        await updateTask(initialData!.id, taskData);
        setToast({ message: 'Task updated successfully!', type: 'success' });
      } else {
        await createTask(taskData);
        setToast({ message: `Task created successfully.`, type: 'success' });
      }

      onClose();
    } catch (error: any) { // FIX 5: Type error parameter
      setToast({ message: 'Failed to save task.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl my-8" onClick={e => e.stopPropagation()}>
        {/* Simple Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">
            {isEditing ? 'Edit Task' : 'Add Task'}
          </h3>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 space-y-4">
          <Input placeholder="Task Name" id="name" {...register('name')} error={errors.name?.message} />
          <div>
            <textarea
              placeholder="Description"
              id="description"
              rows={3}
              {...register('description')}
              className="mt-1 bg-gray-50 border border-gray-300 rounded-md px-3 py-2.5 w-full sm:text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => (
                <DatePicker placeholder="Select date" id="dueDate" value={field.value || undefined} onChange={field.onChange} />
              )}
            />
            <Select id="priority" {...register('priority')} error={errors.priority?.message}>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
              <option value="High">High</option>
            </Select>
          </div>
          <Select id="assignedToId" {...register('assignedToId')} error={errors.assignedToId?.message}>
            <option value="">Select User</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name} ({user.role.replace(/_/g, ' ')})</option>
            ))}
          </Select>

          <div className="pt-4 border-t">
            <h4 className="text-md font-semibold text-gray-800 mb-2">Escalation Matrix (Optional)</h4>
            <p className="text-sm text-gray-500 mb-4">Define who gets notified if this task becomes overdue and set the time gaps for each escalation.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select id="escalationLevel1UserId" {...register('escalationLevel1UserId')} error={errors.escalationLevel1UserId?.message}>
                <option value="">Select User</option>
                {users.filter(u => u.role.includes('manager') || u.role === 'admin').map(user => (<option key={user.id} value={user.id}>{user.name}</option>))}
              </Select>
              {watchEscalationL1User && (
                <Input placeholder="Days until L1 Escalation" id="escalationLevel1DurationDays" type="number" {...register('escalationLevel1DurationDays')} error={errors.escalationLevel1DurationDays?.message} />
              )}
              <Select id="escalationLevel2UserId" {...register('escalationLevel2UserId')} error={errors.escalationLevel2UserId?.message}>
                <option value="">Select User</option>
                {users.filter(u => u.role.includes('manager') || u.role === 'admin').map(user => (<option key={user.id} value={user.id}>{user.name}</option>))}
              </Select>
              {watchEscalationL2User && (
                <Input placeholder="Days until L2 Escalation" id="escalationLevel2DurationDays" type="number" {...register('escalationLevel2DurationDays')} error={errors.escalationLevel2DurationDays?.message} />
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <Input placeholder="Final Escalation Email" id="escalationEmail" type="email" {...register('escalationEmail')} error={errors.escalationEmail?.message} />
              {watchEscalationEmail && (
                <Input placeholder="Days until Final Escalation" id="escalationEmailDurationDays" type="number" {...register('escalationEmailDurationDays')} error={errors.escalationEmailDurationDays?.message} />
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              className="px-5 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSaving}
              className="px-5 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-md font-medium transition-colors"
            >
              {isEditing ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;