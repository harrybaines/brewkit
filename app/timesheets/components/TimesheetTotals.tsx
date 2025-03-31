"use client";

import React from "react";
import { TimesheetEntry } from "../types";
import { calculateDailyTotal, calculateWeeklyTotal } from "../utils";

interface TimesheetTotalsProps {
  weekDates: Date[];
  timesheetData: TimesheetEntry[];
}

export const TimesheetTotals: React.FC<TimesheetTotalsProps> = ({ weekDates, timesheetData }) => {
  return (
    <div className="grid grid-cols-12 gap-2 items-center p-2 bg-muted/30 rounded-md">
      {/* Project Column - Display label */}
      <div className="col-span-4 flex items-center">
        <span className="font-semibold text-xs">Totals</span>
      </div>

      {/* Time Code Column - Empty */}
      <div className="col-span-1"></div>

      {/* Daily Total Columns */}
      {weekDates.map((date, i) => (
        <div key={i} className="text-left pl-2">
          <div className="font-semibold h-6 flex items-center px-2 text-xs">
            {calculateDailyTotal(date, timesheetData)}
          </div>
        </div>
      ))}

      {/* Weekly Total Column */}
      <div className="text-left pl-2">
        <div className="font-bold text-sm h-6 flex items-center px-2">
          {calculateWeeklyTotal(timesheetData)}
        </div>
      </div>

      {/* Actions Column - Empty */}
      <div></div>
    </div>
  );
};