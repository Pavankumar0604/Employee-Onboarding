// src/pages/dashboard/OperationsDashboardPage.tsx
import React, { useState } from 'react';
import { Calendar, FileText, UserCheck, UserX, Send, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import DatePicker from '../../components/ui/DatePicker';

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
    <div className="relative inline-block">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 border border-sky-400 text-sky-700 rounded-full bg-white hover:bg-sky-50 transition duration-150"
      >
        <Calendar size={18} />
        <span className="font-medium text-sm">{`${currentRange.start} - ${currentRange.end}`}</span>
      </button>

      {/* Popover Content */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[600px] bg-white rounded-xl shadow-2xl z-50 border border-gray-200 flex overflow-hidden">
          
          {/* Left Panel: Presets */}
          <div className="w-1/3 border-r border-gray-100 p-4 space-y-1 text-sm">
            {presets.map((preset) => (
              <div
                key={preset.label}
                onClick={() => handlePresetClick(preset)}
                className={`p-2 rounded-lg cursor-pointer transition duration-100 ${
                  currentRange.label === preset.label
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                {preset.label}
              </div>
            ))}
            
            {/* Custom Range Options (Simulated) */}
            <div className="pt-4 space-y-2">
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="w-4 h-4 border border-gray-300 rounded-sm"></div>
                <span>- days up to today</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="w-4 h-4 border border-gray-300 rounded-sm"></div>
                <span>- days starting today</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Calendar */}
          <div className="w-2/3 p-4">
            
            {/* Selected Range Display */}
            <div className="flex justify-between mb-4 space-x-2">
              <div className="border border-gray-300 rounded-lg p-2 text-center flex-1 font-medium">
                {currentRange.start}
              </div>
              <div className="border border-gray-300 rounded-lg p-2 text-center flex-1 font-medium">
                {currentRange.end}
              </div>
            </div>

            {/* Month Navigation */}
            <div className="flex justify-between items-center mb-4">
              <ChevronLeft size={20} className="cursor-pointer text-gray-600 hover:text-gray-900" />
              <div className="flex space-x-4">
                <span className="font-semibold text-gray-800 flex items-center">
                  November <ChevronDown size={16} className="ml-1 text-gray-500" />
                </span>
                <span className="font-semibold text-gray-800 flex items-center">
                  2025 <ChevronDown size={16} className="ml-1 text-gray-500" />
                </span>
              </div>
              <ChevronRight size={20} className="cursor-pointer text-gray-600 hover:text-gray-900" />
            </div>

            <p className="text-sm font-medium text-gray-700 mb-2">Nov 2025</p>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-gray-500 font-medium">{day}</div>
              ))}
              
              {mockCalendarDays.map((day, index) => (
                <div
                  key={index}
                  onClick={() => handleCalendarDayClick(day.day)}
                  className={`p-1 rounded-full cursor-pointer transition duration-100
                    ${day.isPrevMonth || day.isNextMonth ? 'text-gray-400' : 'text-gray-800'}
                    ${day.isSelected ? 'bg-blue-500 text-white rounded-full' : 'hover:bg-gray-100'}
                    ${day.isToday && !day.isSelected ? 'underline font-bold' : ''}
                  `}
                  style={{
                    backgroundColor: day.isSelected ? '#3b82f6' : 'transparent', // blue-500
                    color: day.isSelected ? 'white' : (day.isPrevMonth || day.isNextMonth ? '#9ca3af' : '#1f2937'), // text-gray-400 or text-gray-800
                    borderRadius: day.isSelected ? '9999px' : '0',
                    padding: '4px',
                    lineHeight: '1.5rem',
                    fontWeight: day.isToday ? 'bold' : 'normal',
                    textDecoration: day.isToday && !day.isSelected ? 'underline' : 'none',
                  }}
                >
                  {day.day}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
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
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Operations Dashboard</h1>
        <DateRangePicker />
      </div>

      {/* Statistics Cards Section */}
      <div className="flex flex-wrap gap-6">
        <StatCard
          title="Total Submissions"
          value={mockStats.totalSubmissions}
          Icon={FileText}
          iconColor="text-sky-700"
          iconBg="bg-sky-100"
        />
        <StatCard
          title="Verified Employees"
          value={mockStats.verifiedEmployees}
          Icon={UserCheck}
          iconColor="text-sky-700"
          iconBg="bg-sky-100"
        />
        <StatCard
          title="Rejected Applications"
          value={mockStats.rejectedApplications}
          Icon={UserX}
          iconColor="text-sky-700"
          iconBg="bg-sky-100"
        />
      </div>

      {/* Assign Field Officer Section */}
      <div className="bg-white p-6 rounded-xl shadow-md space-y-6">
        <div className="border-b pb-4 border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Assign Field Officer
          </h2>
          <div className="w-16 h-0.5 bg-sky-400 mb-2"></div> {/* Skyblue underline */}
          <p className="text-sm text-gray-500">
            Assign a field officer to an organization for a specific date.
          </p>
        </div>

        <div className="flex flex-wrap gap-6 items-end">
          {/* Field Officer Select */}
          <div className="min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Field Officer</label>
            <Select
              id="fieldOfficer"
              options={mockFieldOfficers}
              value={selectedOfficer}
              onChange={(e) => setSelectedOfficer(e.target.value)}
              placeholder="Select Officer"
              className="!p-2.5" // Adjust padding to match image
            >
              <option value="" disabled>Select Officer</option>
            </Select>
          </div>

          {/* Organization/Site Select */}
          <div className="min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Organization/Site</label>
            <Select
              id="organizationSite"
              options={mockSites}
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              placeholder="Select Site"
              className="!p-2.5" // Adjust padding to match image
            >
              <option value="" disabled>Select Site</option>
            </Select>
          </div>

          {/* Assignment Date Picker */}
          <div className="min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Date</label>
            <DatePicker
              id="assignmentDate"
              value={assignmentDate}
              onChange={setAssignmentDate}
              // The DatePicker component handles the input type="date" functionality
            />
          </div>

          {/* Assign Button */}
          <Button
            variant="success"
            size="md"
            icon={<Send size={18} />}
            onClick={handleAssign}
            className="h-[42px] px-6 bg-sky-400 hover:bg-sky-500" // Custom height and color to match image
          >
            Assign
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OperationsDashboardPage;