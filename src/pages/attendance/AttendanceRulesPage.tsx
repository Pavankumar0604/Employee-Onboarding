import React, { useState } from 'react';
import { useSettingsStore, Holiday } from '../../store/settingsStore';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Trash2, Plus, Settings, Calendar, Clock, LifeBuoy, Bell } from 'lucide-react';
import DatePicker from '../../components/ui/DatePicker';
import Toast from '../../components/ui/Toast';
import Checkbox from '../../components/ui/Checkbox';
import { api } from '../../services/api';

const AttendanceRulesPage: React.FC = () => {
    const { attendance, updateAttendanceSettings } = useSettingsStore();
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [loadingHolidays, setLoadingHolidays] = useState(true);
    const [newHolidayName, setNewHolidayName] = useState('');
    const [newHolidayDate, setNewHolidayDate] = useState('');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Fetch holidays from Supabase
    React.useEffect(() => {
        const fetchHolidays = async () => {
            try {
                const data = await api.getHolidays();
                if (data) {
                    setHolidays(data.map(h => ({ name: h.name, date: h.date, id: h.id } as Holiday)));
                } else {
                    setHolidays([]);
                }
            } catch (err) {
                console.error("Failed to fetch holidays", err);
                setToast({ message: 'Failed to fetch holidays', type: 'error' });
            } finally {
                setLoadingHolidays(false);
            }
        };
        fetchHolidays();
    }, []);

    const handleAddHoliday = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newHolidayName && newHolidayDate) {
            if (holidays.some((existingHoliday) => existingHoliday.date === newHolidayDate)) {
                setToast({ message: 'A holiday for this date already exists.', type: 'error' });
                return;
            }
            try {
                const newHoliday = await api.createHoliday({ name: newHolidayName, date: newHolidayDate, type: 'Public Holiday' });
                if (newHoliday) {
                    setHolidays(prev => [...prev, { name: newHoliday.name, date: newHoliday.date, id: newHoliday.id }]);
                    setNewHolidayName('');
                    setNewHolidayDate('');
                    setToast({ message: 'Holiday added successfully.', type: 'success' });
                }
            } catch (error) {
                setToast({ message: 'Failed to add holiday.', type: 'error' });
            }
        } else {
            setToast({ message: 'Please provide both a name and a date.', type: 'error' });
        }
    };

    const handleRemoveHoliday = async (id: string) => {
        try {
            await api.deleteHoliday(id);
            setHolidays(prev => prev.filter(h => h.id !== id));
            setToast({ message: 'Holiday removed successfully.', type: 'success' });
        } catch (error) {
            setToast({ message: 'Failed to remove holiday.', type: 'error' });
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <div className="bg-card p-6 sm:p-8 rounded-xl shadow-card">
                <div className="flex items-start mb-6">
                    <div className="p-3 rounded-full bg-accent-light mr-4">
                        <Settings className="h-6 w-6 text-accent-dark" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-primary-text">Attendance & Leave Rules</h2>
                        <p className="text-muted">Set company-wide rules for attendance and leave calculation.</p>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Work Hours Section */}
                    <section>
                        <h3 className="text-lg font-semibold text-primary-text mb-4 flex items-center"><Clock className="mr-2 h-5 w-5 text-muted" />Work Hours</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Input
                                label="Minimum Hours for Full Day"
                                id="minHoursFull"
                                type="number"
                                value={attendance.minimumHoursFullDay}
                                onChange={(e) => updateAttendanceSettings({ minimumHoursFullDay: parseFloat(e.target.value) || 0 })}
                            />
                            <Input
                                label="Minimum Hours for Half Day"
                                id="minHoursHalf"
                                type="number"
                                value={attendance.minimumHoursHalfDay}
                                onChange={(e) => updateAttendanceSettings({ minimumHoursHalfDay: parseFloat(e.target.value) || 0 })}
                            />
                        </div>
                    </section>

                    {/* Leave Allocation Section */}
                    <section>
                        <h3 className="text-lg font-semibold text-primary-text mb-4 flex items-center"><LifeBuoy className="mr-2 h-5 w-5 text-muted" />Leave Allocation</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                            <Input
                                label="Annual Earned Leaves"
                                id="annualEarnedLeaves"
                                type="number"
                                value={attendance.annualEarnedLeaves}
                                onChange={(e) => updateAttendanceSettings({ annualEarnedLeaves: parseInt(e.target.value, 10) || 0 })}
                            />
                            <Input
                                label="Annual Sick Leaves"
                                id="annualSickLeaves"
                                type="number"
                                value={attendance.annualSickLeaves}
                                onChange={(e) => updateAttendanceSettings({ annualSickLeaves: parseInt(e.target.value, 10) || 0 })}
                            />
                            <Input
                                label="Monthly Floating Holidays"
                                id="monthlyFloatingLeaves"
                                type="number"
                                value={attendance.monthlyFloatingLeaves}
                                onChange={(e) => updateAttendanceSettings({ monthlyFloatingLeaves: parseInt(e.target.value, 10) || 0 })}
                            />
                            <Input
                                label="Sick Leave Cert. After (Days)"
                                id="sickLeaveCertDays"
                                type="number"
                                value={attendance.sickLeaveCertDays}
                                onChange={(e) => updateAttendanceSettings({ sickLeaveCertDays: parseInt(e.target.value, 10) || 0 })}
                            />
                        </div>
                    </section>

                    {/* Notifications Section */}
                    <section>
                        <h3 className="text-lg font-semibold text-primary-text mb-4 flex items-center"><Bell className="mr-2 h-5 w-5 text-muted" />Notifications</h3>
                        <Checkbox
                            id="attendance-notifications"
                            label="Enable Check-in/Check-out Notifications"
                            description="Send a notification to Site Managers, Ops Managers, and HR when a Field Officer checks in or out."
                            checked={attendance.enableAttendanceNotifications}
                            onChange={(checked) => updateAttendanceSettings({ enableAttendanceNotifications: checked })}
                        />
                    </section>

                    {/* Holiday List Section */}
                    <section>
                        <h3 className="text-lg font-semibold text-primary-text mb-4 flex items-center"><Calendar className="mr-2 h-5 w-5 text-muted" />Holiday List</h3>
                        <div className="p-4 bg-page rounded-lg">
                            <h4 className="font-semibold mb-2">Add New Holiday</h4>
                            <form onSubmit={handleAddHoliday} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                                <Input label="Holiday Name" id="holidayName" value={newHolidayName} onChange={e => setNewHolidayName(e.target.value)} />
                                <DatePicker label="Date" id="holidayDate" value={newHolidayDate} onChange={setNewHolidayDate} />
                                <Button type="submit" className="w-full sm:w-auto"><Plus className="mr-2 h-4 w-4" /> Add</Button>
                            </form>
                        </div>
                        <div className="mt-4 space-y-2">
                            {loadingHolidays ? (
                                <p className="text-center text-muted py-4">Loading holidays...</p>
                            ) : holidays.length > 0 ? (
                                holidays.map((currentHoliday: Holiday) => (
                                    <div key={currentHoliday.id} className="flex justify-between items-center p-3 rounded-lg">
                                        <div>
                                            <p className="font-medium">{currentHoliday.name}</p>
                                            <p className="text-sm text-muted">{new Date(currentHoliday.date.replace(/-/g, '/')).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                        </div>
                                        <Button variant="icon" size="sm" onClick={() => handleRemoveHoliday(currentHoliday.id)} aria-label={`Remove ${currentHoliday.name}`}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-muted py-4">No holidays added yet.</p>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AttendanceRulesPage;