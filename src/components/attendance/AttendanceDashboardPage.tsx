import React, { useState, useEffect } from 'react';
import {
  Download, Loader2, User, UserCheck, UserX, Clock, Calendar, BarChart3, TrendingUp, MapPin
} from 'lucide-react';
import { StatData, ChartData } from '../../types/attendance';
import StatCard from '../../components/attendance/StatCard';
import ChartContainer from '../../components/attendance/ChartContainer';
import Button from '../../components/attendance/Button';
import Modal from '../../components/attendance/Modal';
import ReportGenerationModalContent from '../../components/attendance/ReportGenerationModalContent';
import { api } from '../../services/api';

// --- Main Component ---


/**
 * @description Props for the AttendanceDashboardPage component.
 */
interface AttendanceDashboardPageProps {}

/**
 * @description AttendanceDashboardPage component displays key attendance metrics and analytics.
 * @returns {JSX.Element} The AttendanceDashboardPage component.
 */
const AttendanceDashboardPage: React.FC<AttendanceDashboardPageProps> = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState<StatData[] | null>(null);
  const [charts, setCharts] = useState<ChartData[] | null>(null);
  const [activeRange, setActiveRange] = useState<'Today' | 'This Month' | 'This Year' | 'Custom Range'>('Today');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await api.getAttendanceStats();
        const chartsData = await api.getAttendanceCharts();
        setStats(statsData);
        setCharts(chartsData);
      } catch (error) {
        console.error("Failed to fetch attendance data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDownloadClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      {/* Header and Controls */}
      <header className="mb-8 flex justify-between items-start">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Attendance Dashboard</h1>
          
          {/* Date Range Filters */}
          <div className="flex space-x-2 text-sm font-medium">
            {['Today', 'This Month', 'This Year'].map((range) => (
              <button
                key={range}
                onClick={() => setActiveRange(range as any)}
                className={`px-4 py-2 rounded-2xl transition-colors duration-200 ${
                  activeRange === range
                    ? 'bg-green-700 text-white shadow-md'
                    : 'bg-white text-sky-700 border border-sky-400 hover:bg-sky-50'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-end space-y-3">
          {/* Download Report Button */}
          <Button
            variant="secondary"
            onClick={handleDownloadClick}
            className="!bg-white !text-sky-700 !border-sky-400 hover:!bg-sky-50 !px-4 !py-2 !text-sm rounded-2xl"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>

          {/* Custom Range Button */}
          <Button
            variant="secondary"
            onClick={() => setActiveRange('Custom Range')}
            className="bg-white text-sky-700 border-sky-400 hover:bg-sky-50 px-4 py-2 text-sm rounded-2xl"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Custom Range
          </Button>
        </div>
      </header>

      {/* Employee Statistics */}
      <section className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard stat={{ title: "Total Employees", value: 9, icon: User }} />
          <StatCard stat={{ title: "Present Today", value: 1, icon: UserCheck }} />
          <StatCard stat={{ title: "Absent Today", value: 7, icon: UserX }} />
          <StatCard stat={{ title: "On Leave Today", value: 0, icon: Clock }} />
        </div>
      </section>

      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        </div>
      )}

      {!isLoading && stats && charts && (
        <div className="space-y-10">
          {/* Charts Section */}
          <section>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Attendance Trend (Bar Chart) */}
              <ChartContainer
                chart={{
                  title: "Attendance Trend",
                  type: "bar",
                  icon: BarChart3,
                  data: charts?.find(c => c.title === "Attendance Trend")?.data || []
                }}
              />

              {/* Productivity Trend (Avg. Hours) */}
              <ChartContainer
                chart={{
                  title: "Productivity Trend (Avg. Hours)",
                  type: "line",
                  icon: TrendingUp,
                  data: charts?.find(c => c.title === "Productivity Trend (Avg. Hours)")?.data || []
                }}
              />

              {/* Attendance Rate by Site (Pie Chart description) */}
              <div className="bg-white p-6 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <MapPin className="w-5 h-5 text-sky-700 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Attendance Rate by Site</h3>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Larger slices indicate higher attendance rates.
                </p>
                {/* Placeholder for the Pie/Donut chart content */}
                <div className="flex-grow min-h-[150px]">
                  {/* Empty space for the chart */}
                </div>
              </div>
            </div>
          </section>

          {/* Scroll Buttons for "Attendance Rate by Site" (Removed as they are likely handled by the layout component) */}
        </div>
      )}

      {/* Report Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Generate Attendance Report"
      >
        <ReportGenerationModalContent onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default AttendanceDashboardPage;