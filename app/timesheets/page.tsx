"use client";

import { Toaster } from "@/components/ui/sonner";
import { TimesheetHelpDialog } from "./components/TimesheetHelpDialog";
import { TimesheetsPage } from "./components/TimesheetsPage";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Timesheets</h1>
          </div>
          <div>
            <TimesheetHelpDialog />
          </div>
        </div>
      </div>

      {/* Main Timesheet Component */}
      <TimesheetsPage />

      <Toaster />
    </div>
  );
}