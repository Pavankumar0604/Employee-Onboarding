import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type { User, UserRole, Organization } from '../../types/mindmesh';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Tooltip from '../ui/Tooltip';
import { api } from '../../services/api';

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<User>) => void;
  initialData?: User | null;
  isSaving: boolean;
}

const validationSchema = yup.object({
  id: yup.string().required(),
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  role: yup.string<UserRole>().required('Role is required'),
  phone: yup.string().optional(),
  organizationId: yup.string().when('role', {
    is: 'site_manager' as UserRole,
    then: schema => schema.required('Site manager must be assigned to a site.'),
    otherwise: schema => schema.optional().nullable(),
  }),
  organizationName: yup.string().optional().nullable(),
  reportingManagerId: yup.string().optional(),
}).defined();

const UserForm: React.FC<UserFormProps> = ({ isOpen, onClose, onSave, initialData, isSaving }) => {
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<User>({
    // FIX: Provide explicit generic type to yupResolver to fix type inference issues.
    resolver: yupResolver(validationSchema) as any,
  });

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const isEditing = !!initialData;
  const role = watch('role');

  useEffect(() => {
    if (isOpen) {
      api.getOrganizations().then(orgs => setOrganizations(orgs || []));
      if (initialData) {
        reset(initialData);
      } else {
        reset({ id: `user_${Date.now()}`, name: '', email: '', role: 'field_officer' });
      }
    }
  }, [initialData, reset, isOpen]);

  const handleOrgChange = (selectedOption: { value: string; label: string } | null) => {
    const orgId = selectedOption ? selectedOption.value : '';
    const org = organizations.find(o => o.id === orgId);
    setValue('organizationId', orgId);
    setValue('organizationName', org?.shortName || '');
  };

  const onSubmit: SubmitHandler<User> = (data) => {
    onSave(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-75">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-lg m-4 animate-fade-in-scale">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <h3 className="text-2xl font-semibold text-gray-900">{isEditing ? 'Edit User' : 'Add User'}</h3>
          <div>
            <Tooltip content="Enter the user's full name (first and last).">
              <Input label="Full Name (First and Last)" id="name" {...register('name')} error={errors.name?.message} />
            </Tooltip>
          </div>
          <div>
            <Tooltip content="Enter the user's email address.">
              <Input label="Email Address" id="email" type="email" {...register('email')} error={errors.email?.message} />
            </Tooltip>
          </div>
          <div>
            <Tooltip content="Select the user's role within the organization.">
              <Select
                label="Role"
                id="role"
                {...register('role')}
                options={[
                  { value: 'field_officer', label: 'Field Officer' },
                  { value: 'site_manager', label: 'Site Manager' },
                  { value: 'operation_manager', label: 'Operation Manager' },
                  { value: 'hr', label: 'HR' },
                  { value: 'admin', label: 'Admin' },
                  { value: 'developer', label: 'Developer' },
                ]}
                value={watch('role')}
                onChange={(e) => setValue('role', e.target.value as UserRole)}
                error={errors.role?.message}
              />
            </Tooltip>
            {role === ('site_manager' as UserRole) && (
              <Select
                label="Organization"
                id="organizationId"
                options={organizations.map((org) => ({ value: org.id, label: org.shortName }))}
                value={watch('organizationId') || ''}
                onChange={(e) => handleOrgChange({ value: e.target.value, label: e.target.options[e.target.selectedIndex].text })}
                error={errors.organizationId?.message}
              />
            )}
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <Button type="button" onClick={onClose} variant="secondary">Cancel</Button>
            <Button type="submit" loading={isSaving}>{isEditing ? 'Save Changes' : 'Create User'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;