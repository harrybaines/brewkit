"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import dayjs from "dayjs";
import { MessageSquare, MoreVertical, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { projectsData, timeCodesData } from "../data";
import { EditingCellType, TimesheetEntry } from "../types";
import { calculateProjectTotal } from "../utils";
import { CommentDialog } from "./CommentDialog";

interface TimesheetRowProps {
  entry: TimesheetEntry;
  weekDates: Date[];
  isLastRow: boolean;
  editingProject: number | null;
  editingTimeCode: number | null;
  comboboxOpen: boolean;
  timeCodeComboboxOpen: boolean;
  editingCell: EditingCellType;
  timesheetData: TimesheetEntry[];
  onProjectClick: (entryId: number) => void;
  onComboboxOpenChange: (open: boolean) => void;
  onTimeCodeOpenChange: (open: boolean) => void;
  onProjectChange: (entryId: number, newProjectId: number) => void;
  onTimeCodeClick: (entryId: number) => void;
  onTimeCodeChange: (entryId: number, timeCode: string) => void;
  onCellClick: (rowId: number, date: string) => void;
  onCellBlur: () => void;
  onHoursChange: (projectId: number, date: string, value: string) => void;
  onDeleteRow: (entryId: number) => void;
  onCommentChange: (entryId: number, comment: string) => void;
}

export const TimesheetRow: React.FC<TimesheetRowProps> = ({
  entry,
  weekDates,
  isLastRow,
  editingProject,
  editingTimeCode,
  comboboxOpen,
  timeCodeComboboxOpen,
  editingCell,
  timesheetData,
  onProjectClick,
  onComboboxOpenChange,
  onTimeCodeOpenChange,
  onProjectChange,
  onTimeCodeClick,
  onTimeCodeChange,
  onCellClick,
  onCellBlur,
  onHoursChange,
  onDeleteRow,
  onCommentChange,
}) => {
  // Helper to check if a cell is being edited
  const isEditingCell = (rowId: number, date: string) => {
    return editingCell?.rowId === rowId && editingCell?.date === date;
  };

  // State for comment dialog
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);

  // Handle comment save
  const handleCommentSave = (comment: string) => {
    onCommentChange(entry.id, comment);
  };

  return (
    <div
      key={entry.id}
      className={`grid grid-cols-12 gap-2 items-center hover:bg-muted/25 p-2 transition-colors border-b border-gray-100 ${isLastRow ? "" : "mb-1"} text-sm`}
    >
      {/* Project Column */}
      <div className="col-span-4 flex items-center gap-1">
        {editingProject === entry.id ? (
          <Popover open={comboboxOpen} onOpenChange={onComboboxOpenChange}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={comboboxOpen}
                className="justify-between w-full h-8 text-sm"
                autoFocus
              >
                {entry.projectName !== "" ? (
                  <div className="flex items-center gap-2 truncate">
                    {entry.projectCode && (
                      <Badge variant="outline" className="font-mono text-xs px-1.5 py-0 bg-white">
                        {entry.projectCode}
                      </Badge>
                    )}
                    <span>{entry.projectName}</span>
                  </div>
                ) : ""}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="p-0"
              align="start"
              sideOffset={0}
              style={{ width: 'var(--radix-popover-trigger-width)' }}
            >
              <Command className="w-full">
                <CommandInput placeholder="Search projects..." />
                <CommandEmpty>No project found.</CommandEmpty>
                <CommandGroup>
                  {projectsData.map((project) => (
                    <CommandItem
                      key={project.id}
                      value={project.name}
                      onSelect={() => {
                        onProjectChange(entry.id, project.id);
                      }}
                    >
                      <Badge variant="outline" className="mr-2 font-mono text-xs px-1.5 py-0 bg-white">
                        {project.code}
                      </Badge>
                      <span className="text-sm">{project.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        ) : (
          <div
            className="flex-1 cursor-pointer hover:bg-muted/50 rounded px-2"
            onClick={() => onProjectClick(entry.id)}
          >
            {entry.projectName && entry.projectName !== "" ? (
              <div className="w-full flex flex-col">
                <div className="font-medium flex items-center gap-2 text-sm">
                  {entry.projectCode && (
                    <Badge variant="outline" className="font-mono text-xs px-1.5 py-0 bg-white">
                      {entry.projectCode}
                    </Badge>
                  )}
                  <span>{entry.projectName}</span>
                </div>
                {entry.projectId > 0 && (
                  <div
                    className={`mt-2 flex items-center gap-1.5 -ml-1.5 ${entry.comment ? 'py-0.5 px-2 rounded-md cursor-pointer hover:bg-primary/10 text-primary' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCommentDialogOpen(true);
                    }}
                    title={entry.comment || "Add comment"}
                  >
                    {entry.comment ? (
                      <>
                        <div className="relative">
                          <MessageSquare className="h-3.5 w-3.5 flex-shrink-0" />
                          <div className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-green-500 ring-1 ring-white" />
                        </div>
                        <span className="text-xs font-medium overflow-hidden whitespace-nowrap text-ellipsis max-w-[180px] text-muted-foreground/80">
                          {entry.comment}
                        </span>
                      </>
                    ) : (
                      <div className="border border-dashed border-muted-foreground/30 rounded px-2 py-0.5 hover:bg-muted/50 cursor-pointer flex items-center gap-1 bg-white">
                        <MessageSquare className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/60" />
                        <span className="text-xs font-medium text-muted-foreground/60">
                          Add comment
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-8 flex items-center text-muted-foreground/70 text-sm border border-dashed border-muted-foreground/30 rounded px-2 w-full" />
            )}
          </div>
        )}
      </div>

      {/* Time Code Column */}
      <div className="col-span-1 flex items-center">
        {editingTimeCode === entry.id ? (
          <Popover open={timeCodeComboboxOpen} onOpenChange={onTimeCodeOpenChange}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={timeCodeComboboxOpen}
                className="justify-between w-full h-8 text-sm"
                autoFocus
              >
                {entry.timeCode ? (
                  <div className="flex items-center gap-2 truncate">
                    <Badge variant="outline" className="font-mono text-xs px-1.5 py-0 bg-white">
                      {entry.timeCode}
                    </Badge>
                    {entry.timeCodeName && entry.timeCodeName !== entry.timeCode && (
                      <span className="text-xs truncate">{entry.timeCodeName}</span>
                    )}
                  </div>
                ) : ""}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="p-0"
              align="start"
              sideOffset={0}
              style={{ width: 'var(--radix-popover-trigger-width)' }}
            >
              <Command className="w-full">
                <CommandInput placeholder="Find time code..." />
                <CommandEmpty>No time code found.</CommandEmpty>

                {/* Chargeable Codes - with subgroups */}
                <CommandGroup heading="Chargeable">
                  {timeCodesData.chargeable.map((group, groupIndex) => (
                    <React.Fragment key={`chargeable-${groupIndex}`}>
                      <CommandItem disabled className="py-1 text-xs opacity-50 pointer-events-none">
                        {group.group}
                      </CommandItem>
                      {group.codes.map((code) => (
                        <CommandItem
                          key={code.id}
                          value={`${code.id}-${code.name}`}
                          onSelect={() => {
                            onTimeCodeChange(entry.id, code.id);
                          }}
                          className="pl-6"
                        >
                          <Badge variant="outline" className="mr-2 font-mono text-xs px-1.5 py-0 bg-white">
                            {code.id}
                          </Badge>
                          <span className="text-xs">
                            {code.name}
                          </span>
                        </CommandItem>
                      ))}
                      {groupIndex < timeCodesData.chargeable.length - 1 && (
                        <CommandItem disabled className="h-0 py-0 opacity-0 pointer-events-none" />
                      )}
                    </React.Fragment>
                  ))}
                </CommandGroup>

                {/* Only show non-chargeable options if this is not a real project */}
                {(!entry.projectId || entry.projectId === 0) && (
                  <CommandGroup heading="Non-Chargeable">
                    {timeCodesData.nonChargeable.map((group, groupIndex) => (
                      <React.Fragment key={`non-chargeable-${groupIndex}`}>
                        <CommandItem disabled className="py-1 text-xs opacity-50 pointer-events-none">
                          {group.group}
                        </CommandItem>
                        {group.codes.map((code) => (
                          <CommandItem
                            key={code.id}
                            value={`${code.id}-${code.name}`}
                            onSelect={() => {
                              onTimeCodeChange(entry.id, code.id);
                            }}
                            className="pl-6"
                          >
                            <Badge variant="outline" className="mr-2 font-mono text-xs px-1.5 py-0 bg-white">
                              {code.id}
                            </Badge>
                            <span className="text-xs">
                              {code.name}
                            </span>
                          </CommandItem>
                        ))}
                        {groupIndex < timeCodesData.nonChargeable.length - 1 && (
                          <CommandItem disabled className="h-0 py-0 opacity-0 pointer-events-none" />
                        )}
                      </React.Fragment>
                    ))}
                  </CommandGroup>
                )}
              </Command>
            </PopoverContent>
          </Popover>
        ) : (
          <div
            className="flex-1 cursor-pointer hover:bg-muted/50 rounded px-2 h-8 flex items-center"
            onClick={() => onTimeCodeClick(entry.id)}
          >
            {entry.timeCode ? (
              <div className="flex flex-col justify-center w-full">
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="font-mono text-xs px-1.5 py-0 bg-white">
                    {entry.timeCode}
                  </Badge>
                  {entry.timeCodeName && entry.timeCodeName !== entry.timeCode && (
                    <span className="text-muted-foreground text-xs truncate max-w-[70px]">
                      {entry.timeCodeName}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full h-8 flex items-center text-xs text-muted-foreground/70 border border-dashed border-muted-foreground/30 rounded px-2" />
            )}
          </div>
        )}
      </div>

      {/* Weekday Input Columns */}
      {weekDates.map((date, idx) => {
        const dayKey = dayjs(date).format("YYYY-MM-DD");
        const isEditing = isEditingCell(entry.id, dayKey);
        const hours = entry.hours[dayKey] || 0;

        return (
          <div key={idx} className="text-left pl-2">
            {isEditing ? (
              <Input
                type="number"
                min="0"
                max="24"
                step="0.5"
                className="h-8 w-16 text-left pl-2 text-xs"
                value={hours === 0 ? "" : hours.toString()}
                autoFocus
                onBlur={onCellBlur}
                onChange={(e) => onHoursChange(entry.id, dayKey, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onCellBlur();
                }}
              />
            ) : (
              <div
                className="h-8 flex items-center cursor-pointer hover:bg-muted/50 rounded px-2 w-16"
                onClick={() => onCellClick(entry.id, dayKey)}
              >
                <span className="text-xs">{hours > 0 ? hours : ''}</span>
              </div>
            )}
          </div>
        );
      })}

      {/* Week Total Column */}
      <div className="text-left pl-2">
        <div className="font-bold h-8 flex items-center px-2 text-xs">
          {calculateProjectTotal(entry.projectId, timesheetData)}
        </div>
      </div>

      {/* Row Actions */}
      <div className="flex justify-center items-center h-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full opacity-70 hover:opacity-100 hover:bg-muted"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Row actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem
              className="text-destructive focus:text-destructive flex items-center cursor-pointer text-xs"
              onClick={() => onDeleteRow(entry.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Comment Dialog */}
      <CommentDialog
        open={commentDialogOpen}
        onOpenChange={setCommentDialogOpen}
        initialComment={entry.comment || ""}
        onSave={handleCommentSave}
        projectName={entry.projectName}
      />
    </div>
  );
};