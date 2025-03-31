"use client";

import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import { Copy, Plus, Save, Send } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { allTimeCodes, getInitialTimesheetData, projectsData } from "../data";
import { EditingCellType, TimeCode, TimesheetEntry } from "../types";
import { getWeekDates } from "../utils";
import { CopyLastWeekDialog } from "./CopyLastWeekDialog";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { TimesheetHeader } from "./TimesheetHeader";
import { TimesheetRow } from "./TimesheetRow";
import { TimesheetTotals } from "./TimesheetTotals";
import { WeekNavigator } from "./WeekNavigator";

export const TimesheetsPage: React.FC = () => {
  // State for week navigation
  const [weekOffset, setWeekOffset] = useState(0);
  const weekDates = getWeekDates(weekOffset);

  // State for timesheet data
  const [timesheetData, setTimesheetData] = useState<TimesheetEntry[]>([]);

  // State for editing project
  const [editingProject, setEditingProject] = useState<number | null>(null);
  const [comboboxOpen, setComboboxOpen] = useState(false);

  // State for editing time code
  const [editingTimeCode, setEditingTimeCode] = useState<number | null>(null);
  const [timeCodeComboboxOpen, setTimeCodeComboboxOpen] = useState(false);

  // State for editing hours cell
  const [editingCell, setEditingCell] = useState<EditingCellType | null>(null);

  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<number | null>(null);

  // State for copy last week dialog
  const [copyDialogOpen, setCopyDialogOpen] = useState(false);

  // Initialize timesheet data
  useEffect(() => {
    setTimesheetData(getInitialTimesheetData());
  }, []);

  // Project editing handlers
  const handleProjectClick = (entryId: number) => {
    setEditingProject(entryId);
    setComboboxOpen(true);
  };

  const handleComboboxOpenChange = (open: boolean) => {
    setComboboxOpen(open);
    if (!open) {
      setEditingProject(null);
    }
  };

  const handleProjectChange = (entryId: number, newProjectId: number) => {
    setTimesheetData((prev) =>
      prev.map((entry) => {
        if (entry.id === entryId) {
          const selectedProject = projectsData.find(
            (p) => p.id === newProjectId
          );
          return {
            ...entry,
            projectId: selectedProject?.id || 0,
            projectName: selectedProject?.name || "Unknown Project",
            projectCode: selectedProject?.code || "",
            client: selectedProject?.client || "",
          };
        }
        return entry;
      })
    );
    setComboboxOpen(false);
    setEditingProject(null);
  };

  // Time code editing handlers
  const handleTimeCodeClick = (entryId: number) => {
    setEditingTimeCode(entryId);
    setTimeCodeComboboxOpen(true);
  };

  const handleTimeCodeOpenChange = (open: boolean) => {
    setTimeCodeComboboxOpen(open);
    if (!open) {
      setEditingTimeCode(null);
    }
  };

  const handleTimeCodeChange = (entryId: number, timeCode: string) => {
    setTimesheetData((prev) =>
      prev.map((entry) => {
        if (entry.id === entryId) {
          // Find the time code details
          const timeCodeDetails = allTimeCodes.find((c: TimeCode) => c.id === timeCode);
          return {
            ...entry,
            timeCode: timeCode,
            timeCodeName: timeCodeDetails?.name || "",
          };
        }
        return entry;
      })
    );
    setTimeCodeComboboxOpen(false);
    setEditingTimeCode(null);
  };

  // Hours cell editing handlers
  const handleCellClick = (rowId: number, date: string) => {
    setEditingCell({ rowId, date });
  };

  const handleCellBlur = () => {
    setEditingCell(null);
  };

  const handleHoursChange = (projectId: number, date: string, value: string) => {
    setTimesheetData((prev) =>
      prev.map((entry) => {
        if (entry.id === projectId) {
          return {
            ...entry,
            hours: {
              ...entry.hours,
              [date]: Number(value) || 0,
            },
          };
        }
        return entry;
      })
    );
  };

  // Add new entry handler
  const handleAddEntry = () => {
    const newId = timesheetData.length > 0 ? Math.max(...timesheetData.map(t => t.id)) + 1 : 1;

    setTimesheetData((prev) => [
      ...prev,
      {
        id: newId,
        projectId: 0,
        projectName: "",
        projectCode: "",
        client: "",
        timeCode: "",
        timeCodeName: "",
        hours: {},
      },
    ]);
  };

  // Delete entry handlers
  const handleDeleteRow = (entryId: number) => {
    setEntryToDelete(entryId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (entryToDelete !== null) {
      setTimesheetData((prev) => prev.filter((entry) => entry.id !== entryToDelete));
      setDeleteDialogOpen(false);
      setEntryToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setEntryToDelete(null);
  };

  // Handle save timesheet
  const handleSaveTimesheet = () => {
    toast.success("Timesheet saved successfully", {
      description: `Your timesheet for ${dayjs(weekDates[0]).format("MMM D")} - ${dayjs(weekDates[4]).format("MMM D")} has been saved.`,
    });
  };

  // Handle submit timesheet
  const handleSubmitTimesheet = () => {
    toast.success("Timesheet submitted", {
      description: `Your timesheet for ${dayjs(weekDates[0]).format("MMM D")} - ${dayjs(weekDates[4]).format("MMM D")} has been submitted for approval.`,
    });
  };

  // Handle comment change
  const handleCommentChange = (entryId: number, comment: string) => {
    setTimesheetData((prev) =>
      prev.map((entry) => {
        if (entry.id === entryId) {
          return {
            ...entry,
            comment: comment,
          };
        }
        return entry;
      })
    );

    toast.success("Comment saved", {
      description: "Your timesheet entry comment has been updated.",
    });
  };

  // Handle copy from last week
  const handleCopyFromLastWeek = (selectedProjectIds: number[]) => {
    // Get the highest ID currently in the timesheet
    const highestId = timesheetData.length > 0
      ? Math.max(...timesheetData.map(t => t.id))
      : 0;

    // Create new entries for the selected projects
    const newEntries = selectedProjectIds.map((projectId, index) => {
      const project = projectsData.find(p => p.id === projectId);
      const timeCode = "1"; // Default time code (would come from last week's data)
      const timeCodeName = "Design"; // Default time code name

      return {
        id: highestId + index + 1,
        projectId: project?.id || 0,
        projectCode: project?.code || "",
        projectName: project?.name || "",
        client: project?.client || "",
        timeCode,
        timeCodeName,
        hours: {},
      } as TimesheetEntry;
    });

    // Add the new entries to the timesheet data
    setTimesheetData(prev => [...prev, ...newEntries]);

    // Show success toast
    toast.success("Projects copied from last week", {
      description: `${newEntries.length} project(s) were copied to this week's timesheet.`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        {/* Week Navigation */}
        <WeekNavigator
          weekOffset={weekOffset}
          setWeekOffset={setWeekOffset}
          weekDates={weekDates}
        />

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => setCopyDialogOpen(true)}
          >
            <Copy className="h-4 w-4" />
            Copy Last Week
          </Button>
          <Button variant="outline" size="sm" className="gap-1" onClick={handleSaveTimesheet}>
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button size="sm" className="gap-1" onClick={handleSubmitTimesheet}>
            <Send className="h-4 w-4" />
            Submit
          </Button>
        </div>
      </div>

      {/* Timesheet Table */}
      <div className="rounded-md">
        {/* Table Header */}
        <TimesheetHeader weekDates={weekDates} />

        {/* Table Body */}
        <div className="px-2 pb-2">
          {timesheetData.map((entry, index) => (
            <TimesheetRow
              key={entry.id}
              entry={entry}
              weekDates={weekDates}
              isLastRow={index === timesheetData.length - 1}
              editingProject={editingProject}
              editingTimeCode={editingTimeCode}
              comboboxOpen={comboboxOpen}
              timeCodeComboboxOpen={timeCodeComboboxOpen}
              editingCell={editingCell}
              timesheetData={timesheetData}
              onProjectClick={handleProjectClick}
              onComboboxOpenChange={handleComboboxOpenChange}
              onTimeCodeOpenChange={handleTimeCodeOpenChange}
              onProjectChange={handleProjectChange}
              onTimeCodeClick={handleTimeCodeClick}
              onTimeCodeChange={handleTimeCodeChange}
              onCellClick={handleCellClick}
              onCellBlur={handleCellBlur}
              onHoursChange={handleHoursChange}
              onDeleteRow={handleDeleteRow}
              onCommentChange={handleCommentChange}
            />
          ))}
        </div>

        {/* Totals Row */}
        <div className="px-2 mt-1">
          <TimesheetTotals weekDates={weekDates} timesheetData={timesheetData} />
        </div>

        {/* Add Entry Button */}
        <div className="mt-4 px-2 pb-2">
          <Button
            size="sm"
            variant="outline"
            className="gap-1"
            onClick={handleAddEntry}
          >
            <Plus className="h-4 w-4" />
            Add Entry
          </Button>
        </div>
      </div>

      {/* Copy Last Week Dialog */}
      <CopyLastWeekDialog
        open={copyDialogOpen}
        onOpenChange={setCopyDialogOpen}
        onCopy={handleCopyFromLastWeek}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};