import { useState, FC, useEffect } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import type { Holiday } from '../../types/attendance';
import { format } from 'date-fns';
import { api } from '../../services/api';
import { Settings, Clock, Bell, Calendar, Plus, Trash2, Users } from 'lucide-react';
import Button from '../../components/ui/Button';
import DatePicker from '../../components/ui/DatePicker';
import Toast from '../../components/ui/Toast';
import Input from '../../components/ui/Input';
import Checkbox from '../../components/ui/Checkbox';

// --- Date Helper Functions (Kept for potential future use or compatibility) ---

const AttendancePage: FC = () => {
    const { attendance: attendanceSettings } = useSettingsStore(); // Removed local 'holidays' from store destructuring
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // State for holiday list management, now fetched directly
    const [holidayList, setHolidayList] = useState<Holiday[]>([]);
    const [isLoadingHolidays, setIsLoadingHolidays] = useState(true);

    // Initialize rules state using existing settings and placeholders
    const [rules, setRules] = useState({
        minHoursFullDay: attendanceSettings.minimumHoursFullDay || 8,
        minHoursHalfDay: attendanceSettings.minimumHoursHalfDay || 4,
        annualEarnedLeaves: 5,
        annualSickLeaves: 12,
        monthlyFloatingHolidays: 1,
        sickLeaveCertAfterDays: 2,
        enableCheckInOutNotifications: false,
    });

    const [newHolidayName, setNewHolidayName] = useState('');
    const [newHolidayDate, setNewHolidayDate] = useState('');

    // Fetch holidays on component mount
    useEffect(() => {
        const fetchHolidays = async () => {
            try {
                const data = await api.getHolidays();
                // Map HolidayRow (from DB) to Holiday (from types/attendance.ts)
                if (data) {
                    setHolidayList(data.map(row => ({
                        id: row.id,
                        date: row.date,
                        name: row.name,
                    } as Holiday)));
                }
            } catch (error) {
                console.error("Failed to fetch holidays:", error);
                setToast({ message: 'Failed to load holidays.', type: 'error' });
            } finally {
                setIsLoadingHolidays(false);
            }
        };
        fetchHolidays();
    }, []);

    // Helper component for section headers
    const SectionHeader: FC<{ title: string, description?: string, icon: React.ElementType }> = ({ title, description, icon: Icon }) => (
        <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gray-100 rounded-full">
                <Icon className="h-5 w-5 text-sky-700" />
            </div>
            <div>
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
            </div>
        </div>
    );

    // Placeholder functions for interaction
    const handleRuleChange = (key: keyof typeof rules, value: string | number | boolean) => {
        setRules(prev => ({ ...prev, [key]: value }));
    };

    const handleSaveRules = () => {
        setIsSaving(true);
        // In a real implementation, this would call an API to update settings
        // For now, we simulate success and update the store (if possible, but we don't have the API call here)
        setTimeout(() => {
            setIsSaving(false);
            setToast({ message: 'Rules saved successfully!', type: 'success' });
        }, 1000);
    };

    const handleAddHoliday = async () => {
        if (!newHolidayName || !newHolidayDate) return;

        setIsSaving(true);
        try {
            // Ensure date is in yyyy-MM-dd format for consistency
            const formattedDate = format(new Date(newHolidayDate), 'yyyy-MM-dd');

            const newHolidayData = {
                name: newHolidayName,
                date: formattedDate,
                type: 'Public Holiday', // Default type, can be expanded later
            };

            const result = await api.createHoliday(newHolidayData);

            if (result) {
                const newHoliday: Holiday = { id: result.id, name: result.name, date: result.date };
                setHolidayList(prev => [...prev, newHoliday]);
                setNewHolidayName('');
                setNewHolidayDate('');
                setToast({ message: 'Holiday added successfully!', type: 'success' });
            } else {
                throw new Error("API returned null result.");
            }
        } catch (error) {
            console.error("Error adding holiday:", error);
            setToast({ message: `Failed to add holiday: ${error instanceof Error ? error.message : 'Unknown error'}`, type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteHoliday = async (holidayId: string) => {
        setIsSaving(true);
        try {
            await api.deleteHoliday(holidayId);
            setHolidayList(holidayList.filter(h => h.id !== holidayId));
            setToast({ message: 'Holiday deleted successfully.', type: 'success' });
        } catch (error) {
            console.error("Error deleting holiday:", error);
            setToast({ message: `Failed to delete holiday: ${error instanceof Error ? error.message : 'Unknown error'}`, type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    // UI structure implementation
    return (
        <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">

                {/* Header */}
                <div className="mb-8 pb-6 border-b border-gray-200">
                    <SectionHeader
                        title="Attendance & Leave Rules"
                        description="Set company-wide rules for attendance and leave calculation."
                        icon={Settings}
                    />
                </div>

                {/* Work Hours Section */}
                <div className="mb-8">
                    <SectionHeader title="Work Hours" icon={Clock} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Minimum Hours for Full Day"
                            type="number"
                            value={rules.minHoursFullDay}
                            onChange={(e) => handleRuleChange('minHoursFullDay', parseInt(e.target.value) || 0)}
                            placeholder="8"
                        />
                        <Input
                            label="Minimum Hours for Half Day"
                            type="number"
                            value={rules.minHoursHalfDay}
                            onChange={(e) => handleRuleChange('minHoursHalfDay', parseInt(e.target.value) || 0)}
                            placeholder="4"
                        />
                    </div>
                </div>

                {/* Leave Allocation Section */}
                <div className="mb-8">
                    <SectionHeader title="Leave Allocation" icon={Users} />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Input
                            label="Annual Earned Leaves"
                            type="number"
                            value={rules.annualEarnedLeaves}
                            onChange={(e) => handleRuleChange('annualEarnedLeaves', parseInt(e.target.value) || 0)}
                            placeholder="5"
                        />
                        <Input
                            label="Annual Sick Leaves"
                            type="number"
                            value={rules.annualSickLeaves}
                            onChange={(e) => handleRuleChange('annualSickLeaves', parseInt(e.target.value) || 0)}
                            placeholder="12"
                        />
                        <Input
                            label="Monthly Floating Holidays"
                            type="number"
                            value={rules.monthlyFloatingHolidays}
                            onChange={(e) => handleRuleChange('monthlyFloatingHolidays', parseInt(e.target.value) || 0)}
                            placeholder="1"
                        />
                        <Input
                            label="Sick Leave Cert. After (Days)"
                            type="number"
                            value={rules.sickLeaveCertAfterDays}
                            onChange={(e) => handleRuleChange('sickLeaveCertAfterDays', parseInt(e.target.value) || 0)}
                            placeholder="2"
                        />
                    </div>
                </div>

                {/* Notifications Section */}
                <div className="mb-8">
                    <SectionHeader title="Notifications" icon={Bell} />
                    <div className="flex items-start space-x-3">
                        <Checkbox
                            id="check-in-out-notifications"
                            checked={rules.enableCheckInOutNotifications}
                            onChange={(checked: boolean) => handleRuleChange('enableCheckInOutNotifications', checked)}
                        />
                        <div className="flex flex-col">
                            <label htmlFor="check-in-out-notifications" className="text-sm font-medium text-gray-700 cursor-pointer">
                                Enable Check-in/Check-out Notifications
                            </label>
                            <p className="text-xs text-gray-500 mt-1">
                                Send a notification to Site Managers, Ops Managers, and HR when a Field Officer checks in or out.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Holiday List Section */}
                <div className="mb-8">
                    <SectionHeader title="Holiday List" icon={Calendar} />

                    {/* Add New Holiday Form */}
                    <div className="flex space-x-4 mb-6 items-end">
                        <div className="flex-1">
                            <Input
                                label="Holiday Name"
                                placeholder="Holiday Name"
                                value={newHolidayName}
                                onChange={(e) => setNewHolidayName(e.target.value)}
                            />
                        </div>
                        <div className="w-40">
                            <DatePicker
                                label="Date"
                                value={newHolidayDate}
                                onChange={setNewHolidayDate}
                                placeholder="Select date"
                            />
                        </div>
                        <Button
                            onClick={handleAddHoliday}
                            className="bg-sky-400 hover:bg-sky-500 text-white px-6 py-3 flex items-center"
                            disabled={!newHolidayName || !newHolidayDate || isSaving}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            {isSaving ? 'Adding...' : 'Add'}
                        </Button>
                    </div>

                    {/* Holiday List Display */}
                    <div className="space-y-3">
                        {isLoadingHolidays ? (
                            <p className="text-gray-500 text-sm">Loading holidays...</p>
                        ) : holidayList.length === 0 ? (
                            <p className="text-gray-500 text-sm">No holidays configured yet.</p>
                        ) : (
                            holidayList.map((holiday) => (
                                <div key={holiday.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div>
                                        <p className="font-medium text-gray-800">{holiday.name}</p>
                                        <p className="text-sm text-gray-500">{format(new Date(holiday.date), 'dd MMMM yyyy')}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteHoliday(holiday.id)}
                                        className="text-red-500 hover:text-red-700 p-1 transition-colors"
                                        aria-label={`Delete ${holiday.name}`}
                                        disabled={isSaving}
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Save Button (Footer) */}
                <div className="pt-6 border-t border-gray-200 flex justify-end">
                    <Button onClick={handleSaveRules} disabled={isSaving} className="bg-sky-400 hover:bg-sky-500 text-white px-6 py-3">
                        {isSaving ? 'Saving...' : 'Save Rules'}
                    </Button>
                </div>

            </div>
            {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
        </div>
    );
};

export default AttendancePage;
