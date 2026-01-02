// src/pages/dashboard/OperationsDashboardPage.tsx
import React, { useState } from 'react';
import { Calendar, FileText, UserCheck, UserX, Send, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import DatePicker from '../../components/ui/DatePicker';
import PageHeader from '../../components/layout/PageHeader';

// Mock data for demonstration
const mockStats = {
  totalSubmissions: 12,
  verifiedEmployees: 4,
  rejectedApplications: 4,
};

const mockFieldOfficers = [
  { value: 'officer1', label: 'Field Officer 1' },
  { value: 'officer2', label: 'Field Officer 2' },
];

const mockSites = [
  { value: 'siteA', label: 'Site A' },
  { value: 'siteB', label: 'Site B' },
];

// --- Complex Date Range Picker Component (Internal) ---

interface DateRange {
  start: string;
  end: string;
  label: string;
}

const DateRangePicker: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentRange, setCurrentRange] = useState<DateRange>({
    start: 'Nov 2, 2025',
    end: 'Nov 8, 2025',
    label: 'Last Week',
  });

  const presets = [
    { label: 'Today', range: { start: 'Nov 15, 2025', end: 'Nov 15, 2025' } },
    { label: 'Yesterday', range: { start: 'Nov 14, 2025', end: 'Nov 14, 2025' } },
    { label: 'This Week', range: { start: 'Nov 10, 2025', end: 'Nov 16, 2025' } },
    { label: 'Last Week', range: { start: 'Nov 2, 2025', end: 'Nov 8, 2025' } },
    { label: 'This Month', range: { start: 'Nov 1, 2025', end: 'Nov 30, 2025' } },
    { label: 'Last Month', range: { start: 'Oct 1, 2025', end: 'Oct 31, 2025' } },
  ];

  // Mock calendar data for November 2025 (matching the image)
  const mockCalendarDays = [
    { day: 26, isPrevMonth: true }, { day: 27, isPrevMonth: true }, { day: 28, isPrevMonth: true }, { day: 29, isPrevMonth: true }, { day: 30, isPrevMonth: true }, { day: 31, isPrevMonth: true }, { day: 1, isNextMonth: false },
    { day: 2, isSelected: true }, { day: 3, isSelected: true }, { day: 4, isSelected: true }, { day: 5, isSelected: true }, { day: 6, isSelected: true }, { day: 7, isSelected: true }, { day: 8, isSelected: true },
    { day: 9 }, { day: 10 }, { day: 11 }, { day: 12 }, { day: 13 }, { day: 14 }, { day: 15, isToday: true },
    { day: 16 }, { day: 17 }, { day: 18 }, { day: 19 }, { day: 20 }, { day: 21 }, { day: 22 },
    { day: 23 }, { day: 24 }, { day: 25 }, { day: 26 }, { day: 27 }, { day: 28 }, { day: 29 },
    { day: 30 }, { day: 1, isNextMonth: true }, { day: 2, isNextMonth: true }, { day: 3, isNextMonth: true }, { day: 4, isNextMonth: true }, { day: 5, isNextMonth: true }, { day: 6, isNextMonth: true },
  ];

  const handlePresetClick = (preset: typeof presets[0]) => {
    setCurrentRange({ ...preset.range, label: preset.label });
    setIsOpen(false);
  };

  const handleCalendarDayClick = (day: number) => {
    // Placeholder for actual date selection logic
    console.log(`Calendar day ${day} clicked.`);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2.5 border-2 border-sky-400 text-sky-700 dark:text-sky-400 rounded-full bg-white dark:bg-gray-800 hover:bg-sky-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium relative z-10"
      >
        <Calendar size={18} />
        <span className="text-sm font-semibold">{`${currentRange.start} - ${currentRange.end}`}</span>
      </button>

      {/* Popover Content - Using Fixed Positioning */}
      {isOpen && (
        <>
          {/* Backdrop to close on outside click */}
          <div
            className="fixed inset-0 z-[100]"
            onClick={() => setIsOpen(false)}
          />

          {/* Popup with fixed positioning - appears on top */}
          <div className="fixed top-32 right-8 w-[600px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex overflow-hidden z-[101]">

            {/* Left Panel: Presets */}
            <div className="w-1/3 border-r border-gray-100 dark:border-gray-700 p-4 space-y-1 text-sm">
              {presets.map((preset) => (
                <div
                  key={preset.label}
                  onClick={() => handlePresetClick(preset)}
                  className={`p-2.5 rounded-lg cursor-pointer transition-all duration-150 ${currentRange.label === preset.label
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium'
                    }`}
                >
                  {preset.label}
                </div>
              ))}

              {/* Custom Range Options (Simulated) */}
              <div className="pt-4 space-y-2">
                <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 text-xs">
                  <div className="w-4 h-4 border border-gray-300 dark:border-gray-600 rounded-sm"></div>
                  <span>- days up to today</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 text-xs">
                  <div className="w-4 h-4 border border-gray-300 dark:border-gray-600 rounded-sm"></div>
                  <span>- days starting today</span>
                </div>
              </div>
            </div>

            {/* Right Panel: Calendar - Redesigned Compact & Attractive */}
            <div className="w-2/3 p-4">

              {/* Selected Range Display - Compact Gradient Design */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 border border-blue-200 dark:border-blue-700 rounded-lg px-3 py-1.5 text-center">
                  <div className="text-[10px] uppercase tracking-wide font-semibold text-blue-600 dark:text-blue-400 mb-0.5">Start</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">{currentRange.start}</div>
                </div>
                <div className="flex-shrink-0 w-6 h-0.5 bg-gradient-to-r from-blue-400 to-sky-400 rounded-full"></div>
                <div className="flex-1 bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 border border-sky-200 dark:border-sky-700 rounded-lg px-3 py-1.5 text-center">
                  <div className="text-[10px] uppercase tracking-wide font-semibold text-sky-600 dark:text-sky-400 mb-0.5">End</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">{currentRange.end}</div>
                </div>
              </div>

              {/* Month Navigation - Compact */}
              <div className="flex justify-between items-center mb-3 px-1">
                <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <ChevronLeft size={18} className="text-gray-600 dark:text-gray-400" />
                </button>
                <div className="flex items-center gap-3">
                  <button className="text-sm font-bold text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
                    November <ChevronDown size={14} className="opacity-60" />
                  </button>
                  <button className="text-sm font-bold text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
                    2025 <ChevronDown size={14} className="opacity-60" />
                  </button>
                </div>
                <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <ChevronRight size={18} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Calendar Grid - Tighter, More Attractive */}
              <div className="grid grid-cols-7 gap-0.5 text-center">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                  <div key={idx} className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-1.5">
                    {day}
                  </div>
                ))}

                {mockCalendarDays.map((day, index) => {
                  const isSelected = day.isSelected;
                  const isToday = day.isToday && !day.isSelected;
                  const isOtherMonth = day.isPrevMonth || day.isNextMonth;

                  return (
                    <div
                      key={index}
                      onClick={() => handleCalendarDayClick(day.day)}
                      className={`
                        relative py-1.5 text-xs font-semibold cursor-pointer transition-all duration-150
                        ${isOtherMonth ? 'text-gray-300 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300'}
                        ${isSelected
                          ? 'bg-gradient-to-br from-blue-500 to-sky-500 text-white shadow-md scale-105 rounded-lg'
                          : 'hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:scale-105 rounded-lg'
                        }
                        ${isToday ? 'ring-2 ring-blue-400 ring-inset rounded-lg' : ''}
                      `}
                    >
                      {day.day}
                      {isToday && (
                        <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

const OperationsDashboardPage: React.FC = () => {
  const [selectedOfficer, setSelectedOfficer] = useState('');
  const [selectedSite, setSelectedSite] = useState('');
  const [assignmentDate, setAssignmentDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAssign = () => {
    console.log('Assigning:', { selectedOfficer, selectedSite, assignmentDate });
    // Simulate assignment success by resetting the form fields
    setSelectedOfficer('');
    setSelectedSite('');
    alert(`Assignment successful for ${selectedOfficer} at ${selectedSite} on ${assignmentDate}`);
  };

  return (
    <>
      <PageHeader
        title="Operations Dashboard"
        subtitle="Monitor submissions, track employee verifications, and manage field officer assignments"
        secondaryActions={<DateRangePicker />}
      />

      {/* Statistics Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Submissions"
          value={mockStats.totalSubmissions}
          Icon={FileText}
          iconColor="text-sky-700"
          iconBg="bg-sky-100 dark:bg-sky-900/30"
        />
        <StatCard
          title="Verified Employees"
          value={mockStats.verifiedEmployees}
          Icon={UserCheck}
          iconColor="text-emerald-700"
          iconBg="bg-emerald-100 dark:bg-emerald-900/30"
        />
        <StatCard
          title="Rejected Applications"
          value={mockStats.rejectedApplications}
          Icon={UserX}
          iconColor="text-red-700"
          iconBg="bg-red-100 dark:bg-red-900/30"
        />
      </div>

      {/* Assign Field Officer Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="mb-6">
          <h3 className="text-heading-s font-semibold text-gray-900 dark:text-white mb-2">
            Assign Field Officer
          </h3>
          <p className="text-body-small text-gray-600 dark:text-gray-400">
            Assign a field officer to an organization for a specific date.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          {/* Field Officer Select */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Field Officer</label>
            <Select
              id="fieldOfficer"
              options={mockFieldOfficers}
              value={selectedOfficer}
              onChange={(e) => setSelectedOfficer(e.target.value)}
              placeholder="Select Officer"
              className="!p-3"
            >
              <option value="" disabled>Select Officer</option>
            </Select>
          </div>

          {/* Organization/Site Select */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Organization/Site</label>
            <Select
              id="organizationSite"
              options={mockSites}
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              placeholder="Select Site"
              className="!p-3"
            >
              <option value="" disabled>Select Site</option>
            </Select>
          </div>

          {/* Assignment Date Picker */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Assignment Date</label>
            <DatePicker
              id="assignmentDate"
              value={assignmentDate}
              onChange={setAssignmentDate}
            />
          </div>

          {/* Assign Button */}
          <Button
            variant="success"
            size="md"
            icon={<Send size={18} />}
            onClick={handleAssign}
            className="h-[46px] px-8 bg-sky-400 hover:bg-sky-500 dark:bg-sky-600 dark:hover:bg-sky-700 font-semibold shadow-md hover:shadow-lg transition-all duration-200"
          >
            Assign
          </Button>
        </div>
      </div>
    </>
  );
};

export default OperationsDashboardPage;
