import { useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type { Insurance } from '../../types/mindmesh';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import DatePicker from '../ui/DatePicker';
import { Shield, Building2, FileText, Calendar, X } from 'lucide-react';

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all"
                onClick={e => e.stopPropagation()}
            >
                {/* Gradient Header */}
                <div className="bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-5 relative">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                                <Shield className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">
                                    {initialData ? 'Edit Insurance' : 'Add Insurance'}
                                </h3>
                                <p className="text-sky-100 text-sm mt-0.5">
                                    {initialData ? 'Update insurance details' : 'Create a new insurance policy'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                            aria-label="Close"
                        >
                            <X className="h-5 w-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                    <div className="space-y-5">
                        {/* Insurance Type */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Shield className="h-4 w-4 text-sky-600" />
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
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Building2 className="h-4 w-4 text-sky-600" />
                                Provider
                            </label>
                            <Input
                                id="provider"
                                registration={register('provider')}
                                error={errors.provider?.message}
                                placeholder="Enter insurance provider name"
                                className="w-full"
                            />
                        </div>

                        {/* Policy Number */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <FileText className="h-4 w-4 text-sky-600" />
                                Policy Number
                            </label>
                            <Input
                                id="policyNumber"
                                registration={register('policyNumber')}
                                error={errors.policyNumber?.message}
                                placeholder="Enter policy number"
                                className="w-full"
                            />
                        </div>

                        {/* Valid Till */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Calendar className="h-4 w-4 text-sky-600" />
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
                                        placeholder="Select expiry date"
                                        className="w-full"
                                    />
                                )}
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="px-6"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white px-6 shadow-lg shadow-sky-500/30 transition-all duration-200"
                        >
                            {initialData ? 'Update Insurance' : 'Save Insurance'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InsuranceForm;