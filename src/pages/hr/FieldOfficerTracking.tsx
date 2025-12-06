import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '../../services/api';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { User, UserRole } from '../../types/mindmesh';
import DatePicker from '../../components/ui/DatePicker';
import Select from '../../components/ui/Select';

// FIX: Added local implementation for `startOfMonth` as it was not found in the 'date-fns' module exports.
const startOfMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
};

const endOfMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

import { AttendanceRow } from '../../services/api';

type AttendanceEvent = AttendanceRow & {
    userName?: string;
};

const FieldOfficerTracking: React.FC = () => {
    const [events, setEvents] = useState<AttendanceEvent[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));
    const [selectedOfficer, setSelectedOfficer] = useState('all');

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [eventsData, usersData] = await Promise.all([
                api.getAttendanceRecords(undefined, { start: startDate, end: endDate }),
                api.getAllUsersWithRoles()
            ]);
            setEvents((eventsData || []) as AttendanceEvent[]);

            setUsers(
                (usersData || [])
                    .filter((user: any) => user?.roles?.display_name === 'Field Officer')
                    .map((user: any) => ({
                        id: user.id,
                        email: user.email ?? null,
                        full_name: user.name ?? null,
                        name: user.name || '',
                        role: 'field_officer' as UserRole,
                        organizationId: user.organizationId ?? null,
                        organizationName: null,
                        is_active: true,
                        created_at: user.created_at ?? '',
                        phone_number: user.phone ?? null,
                        photo_url: user.photo_url ?? null,
                    }))
            );
        } catch (error) {
            console.error("Failed to fetch tracking data", error);
        } finally {
            setIsLoading(false);
        }
    }, [startDate, endDate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredEvents = useMemo(() => {
        let results = events;
        if (selectedOfficer !== 'all') {
            results = results.filter(e => e.user_id === selectedOfficer);
        }
        const userMap = new Map(users.map(u => [u.id, u.full_name || u.name]));
        return results
            .map(event => ({ ...event, userName: userMap.get(event.user_id) || 'Unknown Officer' }))
            .sort((a: AttendanceEvent, b: AttendanceEvent) => {
                const aTime = a.check_in_time ? new Date(a.check_in_time).getTime() : 0;
                const bTime = b.check_in_time ? new Date(b.check_in_time).getTime() : 0;
                return aTime - bTime;
            });
    }, [events, users, selectedOfficer]);

    return (
        <div className="bg-card p-6 sm:p-8 rounded-xl shadow-card">
            <AdminPageHeader title="Field Officer Tracking">
                <div className="flex flex-wrap gap-2">
                    <div className="w-48"><DatePicker label="" id="start-date" value={startDate} onChange={setStartDate} /></div>
                    <div className="w-48"><DatePicker label="" id="end-date" value={endDate} onChange={setEndDate} /></div>
                    <div className="w-56">
                        <Select label="" id="officer-select" value={selectedOfficer} onChange={e => setSelectedOfficer(e.target.value)}>
                            <option value="all">All Field Officers</option>
                            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                        </Select>
                    </div>
                </div>
            </AdminPageHeader>
            <div className="overflow-x-auto mt-6">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-page">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">Officer</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">Event</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">Timestamp</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">Location</th>
                        </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                        {isLoading ? (
                            <tr><td colSpan={4} className="text-center py-10 text-muted"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></td></tr>
                        ) : filteredEvents.length === 0 ? (
                            <tr><td colSpan={4} className="text-center py-10 text-muted">No tracking records found.</td></tr>
                        ) : (
                            filteredEvents.map((event, idx) => (
                                <tr key={`${event.id}-${idx}`} className="hover:bg-page/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{event.userName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                        {event.check_out_time ? 'Check Out' : 'Check In'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                                        {event.check_in_time ? format(new Date(event.check_in_time), 'PPp') : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted max-w-xs truncate">
                                        Location data not available
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FieldOfficerTracking;