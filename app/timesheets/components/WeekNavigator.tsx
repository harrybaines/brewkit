"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import React from "react";

interface WeekNavigatorProps {
  weekOffset: number;
  weekDates: Date[];
  setWeekOffset: (offset: number) => void;
}

export const WeekNavigator: React.FC<WeekNavigatorProps> = ({
  weekOffset,
  weekDates,
  setWeekOffset,
}) => {
  // Function to navigate to the previous week
  const goToPreviousWeek = () => {
    setWeekOffset(weekOffset - 1);
  };

  // Function to navigate to the next week
  const goToNextWeek = () => {
    setWeekOffset(weekOffset + 1);
  };

  // Function to reset to current week
  const resetToCurrentWeek = () => {
    setWeekOffset(0);
  };

  // Function to get the week status text
  const getWeekStatusText = () => {
    if (weekOffset === 0) return "This Week";
    if (weekOffset === -1) return "Last Week";
    if (weekOffset === 1) return "Next Week";
    return weekOffset < 0 ? `${Math.abs(weekOffset)} Weeks Ago` : `${weekOffset} Weeks Ahead`;
  };

  // Get the badge variant based on week offset
  const getBadgeVariant = () => {
    if (weekOffset === 0) return "default";
    return "outline";
  };

  return (
    <div className="flex justify-between items-center pl-0 pr-2 pb-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <div className="flex items-center h-8 overflow-hidden border rounded-md bg-card shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0 rounded-none"
              onClick={goToPreviousWeek}
              title="Previous Week"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="px-3 min-w-[120px] text-center">
              <span className="text-sm font-medium whitespace-nowrap">
                {dayjs(weekDates[0]).format("MMM D")} - {dayjs(weekDates[4]).format("MMM D")}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0 rounded-none"
              onClick={goToNextWeek}
              title="Next Week"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="ml-2 h-8 w-8"
            onClick={resetToCurrentWeek}
            title="Current Week"
          >
            <Home className="h-4 w-4" />
          </Button>
        </div>

        <Badge variant={getBadgeVariant()} className="h-6 px-2.5 text-xs font-medium">
          {getWeekStatusText()}
        </Badge>
      </div>
    </div>
  );
};