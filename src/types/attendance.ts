import React from 'react';

export type AttendanceEvent = {
  id: string;
  userId: string;
  timestamp: string;
  type: 'check-in' | 'check-out';
  location?: string;
};

export type DailyAttendanceStatus = 'Present' | 'Absent' | 'Half Day' | 'On Leave (Full)' | 'On Leave (Half)' | 'Weekend' | 'Holiday' | 'Incomplete';

export type DailyAttendanceRecord = {
  date: string;
  day: string;
  checkIn: string | null;
  checkOut: string | null;
  duration: string | null;
  status: DailyAttendanceStatus;
};

export type Holiday = {
  id: string;
  date: string;
  name: string;
};

export type AttendanceSettings = {
  minimumHoursFullDay: number;
  minimumHoursHalfDay: number;
};

export type StatData = {
  title: string;
  value: number;
  icon: React.ElementType<any>; // Use React.ElementType<any> for component types
  color?: string; // For styling accents
  iconBg?: string; // For icon background styling
};

export type ChartData = {
  title: string;
  icon: React.ElementType<any>;
  type: 'bar' | 'line' | 'progress';
  data: any; // Specific structure depends on chart implementation
};