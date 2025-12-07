import { useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type { Insurance } from '../../types/mindmesh';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import DatePicker from '../ui/DatePicker';

const schema = yup.object({
    type: yup.string().oneOf(['GMC', 'GPA', 'WCA', 'Other']).required('Type is required'),
    provider: yup.string().required('Provider is required'),
    policyNumber: yup.string().required('Policy number is required'),
    validTill: yup.string().required('Valid till date is required'),
}).defined();

interface InsuranceFormProps {
    onSave: (data: Omit<Insurance, 'id'>) => void;
    onClose: () => void;
    initialData?: Insurance | null;
}

const InsuranceForm: React.FC<InsuranceFormProps> = ({ onSave, onClose, initialData }) => {
    const { register, handleSubmit, control, formState: { errors }, reset } = useForm<Omit<Insurance, 'id'>>({
        resolver: yupResolver(schema) as any,
    });

    useEffect(() => {
        reset(initialData || { type: 'GMC', provider: '', policyNumber: '', validTill: '' });
    }, [initialData, reset]);

    const onSubmit: SubmitHandler<Omit<Insurance, 'id'>> = (data) => {
        onSave(data);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto" onClick={onClose}>
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-2xl my-8"
                onClick={e => e.stopPropagation()}
            >
                {/* Simple Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800">
                        {initialData ? 'Edit Insurance' : 'Add Insurance'}
                    </h3>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 space-y-4">
                    {/* Insurance Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Insurance Type
                        </label>
                        <Select
                            id="type"
                            registration={register('type')}
                            error={errors.type?.message}
                            className="w-full"
                        >
                            <option>GMC</option>
                            <option>GPA</option>
                            <option>WCA</option>
                            <option>Other</option>
                        </Select>
                    </div>

                    {/* Provider */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Provider
                        </label>
                        <Input
                            id="provider"
                            registration={register('provider')}
                            error={errors.provider?.message}
                            placeholder="Provider Name"
                            className="w-full"
                        />
                    </div>

                    {/* Policy Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Policy Number
                        </label>
                        <Input
                            id="policyNumber"
                            registration={register('policyNumber')}
                            error={errors.policyNumber?.message}
                            placeholder="Policy Number"
                            className="w-full"
                        />
                    </div>

                    {/* Valid Till */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Valid Till
                        </label>
                        <Controller
                            name="validTill"
                            control={control}
                            render={({ field }) => (
                                <DatePicker
                                    id="validTill"
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.validTill?.message}
                                    className="w-full"
                                />
                            )}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="px-5 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="px-5 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-md font-medium transition-colors"
                        >
                            {initialData ? 'Update Insurance' : 'Create Insurance'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InsuranceForm;