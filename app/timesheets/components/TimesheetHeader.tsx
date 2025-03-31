"use client";

import React from "react";
import { formatDayName, formatMonthDay, isToday } from "../utils";

interface TimesheetHeaderProps {
  weekDates: Date[];
}

export const TimesheetHeader: React.FC<TimesheetHeaderProps> = ({ weekDates }) => {
  return (
    <div className="grid grid-cols-12 gap-2 bg-muted/50 rounded-md p-6 mb-0 font-medium text-xs">
      {/* Project Column */}
      <div className="col-span-4 flex items-center">
        <span className="font-bold">Project</span>
      </div>

      {/* Time Code Column */}
      <div className="col-span-1 flex items-center">
        <span className="font-bold">Code</span>
      </div>

      {/* Weekday Columns */}
      {weekDates.map((date, index) => (
        <div key={index} className="pl-2 py-1">
          <div className="text-muted-foreground text-xs text-left mb-1">
            {formatDayName(date)}
          </div>
          <div className="font-semibold text-left flex items-center text-xs">
            <span>{formatMonthDay(date)}</span>
            {isToday(date) && (
              <span className="ml-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 inline-block"></span>
            )}
          </div>
        </div>
      ))}

      {/* Week Total Column */}
      <div className="pl-2 py-1">
        <div className="text-muted-foreground text-xs text-left mb-1">Total</div>
        <div className="font-bold text-left text-xs"></div>
      </div>

      {/* Actions Column */}
      <div className="pl-2 py-1 flex justify-center">
        <span className="sr-only">Actions</span>
      </div>
    </div>
  );
};