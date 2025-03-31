import dayjs from "dayjs";
import { TimesheetEntry } from "./types";

// Generate the current week dates (weekdays only - Monday to Friday)
export const getWeekDates = (weekOffset = 0): Date[] => {
  const today = dayjs();
  const day = today.day(); // 0 is Sunday, 1 is Monday, etc.

  // Calculate the date of the Monday of this week
  const monday = today
    .subtract(day === 0 ? 6 : day - 1, "day")
    .add(weekOffset * 7, "day");

  const weekDates = [];
  // Only add Monday through Friday (5 days)
  for (let i = 0; i < 5; i++) {
    weekDates.push(monday.add(i, "day").toDate());
  }

  return weekDates;
};

// Format the date for header day name
export const formatDayName = (date: Date): string => {
  return dayjs(date).format("ddd");
};

// Format the date for header month and day
export const formatMonthDay = (date: Date): string => {
  return dayjs(date).format("MMM D");
};

// Check if a date is today
export const isToday = (date: Date): boolean => {
  return dayjs(date).isSame(dayjs(), "day");
};

// Calculate daily totals
export const calculateDailyTotal = (
  date: Date,
  timesheetData: TimesheetEntry[]
): number => {
  const dayKey = dayjs(date).format("YYYY-MM-DD");
  return timesheetData.reduce((total, entry) => {
    return total + (entry.hours[dayKey] || 0);
  }, 0);
};

// Calculate weekly total for a project
export const calculateProjectTotal = (
  projectId: number,
  timesheetData: TimesheetEntry[]
): number => {
  const entry = timesheetData.find((e) => e.projectId === projectId);
  if (!entry) return 0;

  return Object.values(entry.hours).reduce((total: number, hours) => {
    return total + (hours || 0);
  }, 0);
};

// Calculate overall weekly total
export const calculateWeeklyTotal = (
  timesheetData: TimesheetEntry[]
): number => {
  return timesheetData.reduce((total, entry) => {
    return (
      total +
      Object.values(entry.hours).reduce(
        (sum: number, hours) => sum + (hours || 0),
        0
      )
    );
  }, 0);
};
