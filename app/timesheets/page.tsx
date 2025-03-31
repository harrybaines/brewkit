"use client"

import dayjs from "dayjs"
import { CalendarIcon, ChevronLeft, ChevronRight, MoreVertical, PlusCircle, Save, Trash2 } from "lucide-react"
import * as React from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

// Example data for demonstration
const projectsData = [
  { id: 1, code: "A1000", name: "School Refurbishment", client: "Oakridge School District" },
  { id: 2, code: "A1001", name: "Church Extension", client: "St. Mary's Parish" },
  { id: 3, code: "A1002", name: "Community Center Renovation", client: "Westside Community Trust" },
  { id: 4, code: "A1003", name: "Hospital Renovation", client: "Mercy Medical Center" },
  { id: 5, code: "A1004", name: "Office Building Renovation", client: "Pinnacle Investments" },
  { id: 6, code: "A1005", name: "Warehouse Renovation", client: "Global Distribution Ltd" },
]

// Time codes data with grouping
const timeCodesData = {
  chargeable: [
    {
      group: "Design & Preparation",
      codes: [
        { id: "1", name: "Design", description: "Design" },
        { id: "2", name: "Preparation", description: "Preparation" },
        { id: "3", name: "Coordination", description: "Coordination" },
      ]
    },
    {
      group: "Technical & Manufacturing",
      codes: [
        { id: "4", name: "Technical Design", description: "Technical Design" },
        { id: "5", name: "Manufacturing", description: "Manufacturing" },
      ]
    },
    {
      group: "Construction & Handover",
      codes: [
        { id: "6", name: "Construction", description: "Construction" },
        { id: "7", name: "Use", description: "Use" }
      ]
    }
  ],
  nonChargeable: [
    {
      group: "Office Admin",
      codes: [
        { id: "ADM", name: "Administration", description: "General administrative tasks" },
        { id: "MTG", name: "Internal Meetings", description: "Non-project specific meetings" }
      ]
    },
    {
      group: "Professional",
      codes: [
        { id: "BUS", name: "Business Development", description: "Marketing and client outreach" },
        { id: "TRN", name: "Training", description: "Professional development activities" },
      ]
    },
    {
      group: "Time Off",
      codes: [
        { id: "LVE", name: "Leave", description: "Holiday, sick leave, etc." },
      ]
    }
  ]
}

// Get all time codes flattened for easier lookup
const allTimeCodes = [
  ...timeCodesData.chargeable.flatMap(group => group.codes),
  ...timeCodesData.nonChargeable.flatMap(group => group.codes)
]

// Create a type for timesheet entry
type TimesheetEntry = {
  id: number
  projectId: number
  projectCode: string
  projectName: string
  client: string
  timeCode: string
  timeCodeName?: string
  hours: {
    [key: string]: number | undefined
  }
}

// Generate the current week dates (weekdays only - Monday to Friday)
const getWeekDates = (weekOffset = 0) => {
  const today = dayjs()
  const day = today.day() // 0 is Sunday, 1 is Monday, etc.

  // Calculate the date of the Monday of this week
  const monday = today.subtract(day === 0 ? 6 : day - 1, 'day').add(weekOffset * 7, 'day')

  const weekDates = []
  // Only add Monday through Friday (5 days)
  for (let i = 0; i < 5; i++) {
    weekDates.push(monday.add(i, 'day').toDate())
  }

  return weekDates
}

// Format the date for header day name
const formatDayName = (date: Date) => {
  return dayjs(date).format("ddd")
}

// Format the date for header month and day
const formatMonthDay = (date: Date) => {
  return dayjs(date).format("MMM D")
}

// Check if a date is today
const isToday = (date: Date) => {
  return dayjs(date).isSame(dayjs(), 'day')
}

// Example timesheet data
const initialTimesheetData: TimesheetEntry[] = projectsData.slice(0, 3).map((project) => {
  const defaultTimeCode = timeCodesData.chargeable[0].codes[0]
  const entry: TimesheetEntry = {
    id: project.id,
    projectId: project.id,
    projectCode: project.code,
    projectName: project.name,
    client: project.client,
    timeCode: defaultTimeCode.id,
    timeCodeName: defaultTimeCode.name,
    hours: {}
  }

  // Add random hours for demonstration
  getWeekDates().forEach((date) => {
    const dayKey = dayjs(date).format("YYYY-MM-DD")
    // Random hours between 0 and 8, some days might have 0 hours
    entry.hours[dayKey] = Math.random() > 0.3 ? Math.floor(Math.random() * 8) + 1 : 0
  })

  return entry
})

export default function TimesheetsPage() {
  const [weekOffset, setWeekOffset] = React.useState(0)
  const [timesheetData, setTimesheetData] = React.useState<TimesheetEntry[]>([])
  const [initialRender, setInitialRender] = React.useState(true)
  const [editingProject, setEditingProject] = React.useState<number | null>(null)
  const [editingTimeCode, setEditingTimeCode] = React.useState<number | null>(null)
  const [comboboxOpen, setComboboxOpen] = React.useState(false)
  const [timeCodeComboboxOpen, setTimeCodeComboboxOpen] = React.useState(false)
  const [editingCell, setEditingCell] = React.useState<{ rowId: number, date: string } | null>(null)
  const [rowToDelete, setRowToDelete] = React.useState<number | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const weekDates = getWeekDates(weekOffset)

  // Initialize data only on the client side to prevent hydration errors
  React.useEffect(() => {
    if (initialRender) {
      setTimesheetData(initialTimesheetData.map(entry => {
        const defaultTimeCode = timeCodesData.chargeable[0].codes[0]
        return {
          ...entry,
          timeCode: defaultTimeCode.id,
          timeCodeName: defaultTimeCode.name
        }
      }))
      setInitialRender(false)
    }
  }, [initialRender])

  // Calculate daily totals
  const calculateDailyTotal = (date: Date) => {
    const dayKey = dayjs(date).format("YYYY-MM-DD")
    return timesheetData.reduce((total, entry) => {
      return total + (entry.hours[dayKey] || 0)
    }, 0)
  }

  // Calculate weekly total for a project
  const calculateProjectTotal = (projectId: number) => {
    const entry = timesheetData.find(e => e.projectId === projectId)
    if (!entry) return 0

    return Object.values(entry.hours).reduce((total: number, hours) => {
      return total + (hours || 0)
    }, 0)
  }

  // Calculate overall weekly total
  const calculateWeeklyTotal = () => {
    return timesheetData.reduce((total, entry) => {
      return total + Object.values(entry.hours).reduce((sum: number, hours) => sum + (hours || 0), 0)
    }, 0)
  }

  // Handle hours input change
  const handleHoursChange = (projectId: number, date: string, value: string) => {
    const numValue = value === "" ? 0 : parseFloat(value)

    if (isNaN(numValue) || numValue < 0 || numValue > 24) return

    setTimesheetData(prevData =>
      prevData.map(entry => {
        if (entry.projectId === projectId) {
          return {
            ...entry,
            hours: {
              ...entry.hours,
              [date]: numValue
            }
          }
        }
        return entry
      })
    )
  }

  // Handle save timesheet
  const handleSave = () => {
    toast.success("Timesheet saved successfully", {
      description: `Timesheet for week of ${dayjs(weekDates[0]).format("MMM D")} to ${dayjs(weekDates[4]).format("MMM D")} saved.`,
      duration: 3000,
    })
  }

  // Handle adding new entry
  const handleAddEntry = () => {
    // Create a new blank entry with a unique ID
    const highestId = Math.max(0, ...timesheetData.map(entry => entry.id));
    const newEntry: TimesheetEntry = {
      id: highestId + 1, // Ensure ID is unique
      projectId: 0,
      projectCode: "",
      projectName: "Click to select a project",
      client: "",
      timeCode: "",
      timeCodeName: "",
      hours: {}
    }

    // Add empty hour entries for each day
    weekDates.forEach(date => {
      const dayKey = dayjs(date).format("YYYY-MM-DD")
      newEntry.hours[dayKey] = 0
    })

    setTimesheetData(prevData => [...prevData, newEntry])

    // Set this new row's project to be in edit mode
    setEditingProject(newEntry.id)
    setComboboxOpen(true)
  }

  // Handle project change
  const handleProjectChange = (entryId: number, newProjectId: number) => {
    const selectedProject = projectsData.find(p => p.id === newProjectId)
    if (!selectedProject) return

    setTimesheetData(prevData =>
      prevData.map(entry => {
        if (entry.id === entryId) {
          return {
            ...entry,
            projectId: selectedProject.id,
            projectCode: selectedProject.code,
            projectName: selectedProject.name,
            client: selectedProject.client,
          }
        }
        return entry
      })
    )

    setEditingProject(null)
    setComboboxOpen(false)

    toast.success("Project updated", {
      description: `Changed to "${selectedProject.name}"`,
      duration: 3000,
    })
  }

  // Function to navigate to the previous week
  const goToPreviousWeek = () => {
    setWeekOffset(prev => prev - 1)
  }

  // Function to navigate to the next week
  const goToNextWeek = () => {
    setWeekOffset(prev => prev + 1)
  }

  // Function to reset to current week
  const resetToCurrentWeek = () => {
    setWeekOffset(0)
    toast.success("Reset to current week", {
      duration: 2000,
    })
  }

  // Helper to check if a cell is being edited
  const isEditingCell = (rowId: number, date: string) => {
    return editingCell?.rowId === rowId && editingCell?.date === date;
  }

  // Helper to handle click on a cell
  const handleCellClick = (rowId: number, date: string) => {
    setEditingCell({ rowId, date });
  }

  // Helper to handle finishing editing a cell
  const handleCellBlur = () => {
    setEditingCell(null);
  }

  // Helper to handle project editing
  const handleProjectClick = (entryId: number) => {
    setEditingProject(entryId);
    setComboboxOpen(true);
  }

  // Helper to end project editing
  const handleProjectBlur = () => {
    setEditingProject(null);
    setComboboxOpen(false);
  }

  // Handle time code change
  const handleTimeCodeChange = (entryId: number, newTimeCode: string) => {
    // Find the selected time code
    const selectedCode = allTimeCodes.find(code => code.id === newTimeCode)
    if (!selectedCode) return

    const isChargeable = timeCodesData.chargeable.some(group =>
      group.codes.some(code => code.id === newTimeCode)
    )

    const entry = timesheetData.find(e => e.id === entryId)

    // Validate: If non-chargeable code selected for a real project, prevent the change
    if (!isChargeable && entry && entry.projectId !== 0) {
      toast.error("Cannot assign non-chargeable code to a project", {
        duration: 3000,
      })
      return
    }

    setTimesheetData(prevData =>
      prevData.map(entry => {
        if (entry.id === entryId) {
          return {
            ...entry,
            timeCode: newTimeCode,
            timeCodeName: selectedCode.name
          }
        }
        return entry
      })
    )

    setEditingTimeCode(null)
    setTimeCodeComboboxOpen(false)

    toast.success("Time code updated", {
      description: `Changed to "${selectedCode.name}"`,
      duration: 3000,
    })
  }

  // Helper to handle time code editing
  const handleTimeCodeClick = (entryId: number) => {
    setEditingTimeCode(entryId);
    setTimeCodeComboboxOpen(true);
  }

  // Helper to end time code editing
  const handleTimeCodeBlur = () => {
    setEditingTimeCode(null);
    setTimeCodeComboboxOpen(false);
  }

  // Handle row deletion
  const handleDeleteRow = (entryId: number) => {
    setRowToDelete(entryId);
    setDeleteDialogOpen(true);
  };

  // Handle confirmation of deletion
  const confirmDeleteRow = () => {
    if (rowToDelete === null) return;

    const entryToDelete = timesheetData.find(entry => entry.id === rowToDelete);
    if (!entryToDelete) return;

    // Store project name before deletion for the toast
    const deletedProjectName = entryToDelete.projectName || "Entry";

    // Delete the row and maintain consistent state
    setTimesheetData(prevData => {
      const filteredData = prevData.filter(entry => entry.id !== rowToDelete);
      // No need to reassign IDs - keep original IDs to prevent hydration issues
      return filteredData;
    });

    // Reset deletion states
    setRowToDelete(null);
    setDeleteDialogOpen(false);

    toast.success("Row deleted", {
      description: `${deletedProjectName} has been removed from your timesheet.`,
      duration: 3000,
    });
  };

  // Cancel deletion
  const cancelDeleteRow = () => {
    setRowToDelete(null);
    setDeleteDialogOpen(false);
  };

  return initialRender ? null : (
    <div className="flex flex-1 flex-col space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Timesheets</h1>
            <p className="text-muted-foreground">Track your time across projects.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-1" onClick={resetToCurrentWeek}>
              <CalendarIcon className="h-4 w-4" />
              Current Week
            </Button>
            <Button onClick={handleSave} className="gap-1">
              <Save className="h-4 w-4" />
              Save Timesheet
            </Button>
          </div>
        </div>
        <Separator />
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={(open) => {
        setDeleteDialogOpen(open);
        if (!open) setRowToDelete(null); // Reset rowToDelete when dialog is closed
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Timesheet Entry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this entry? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDeleteRow}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteRow} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Timesheet Card */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle>Timesheet</CardTitle>
              {weekOffset === 0 ? (
                <Badge variant="secondary" className="h-6 px-2 py-0 text-xs font-normal">
                  This Week
                </Badge>
              ) : weekOffset === -1 ? (
                <Badge variant="outline" className="h-6 px-2 py-0 text-xs font-normal">
                  Last Week
                </Badge>
              ) : weekOffset === 1 ? (
                <Badge variant="outline" className="h-6 px-2 py-0 text-xs font-normal">
                  Next Week
                </Badge>
              ) : weekOffset < 0 ? (
                <Badge variant="outline" className="h-6 px-2 py-0 text-xs font-normal">
                  {Math.abs(weekOffset)} Weeks Ago
                </Badge>
              ) : (
                <Badge variant="outline" className="h-6 px-2 py-0 text-xs font-normal">
                  {weekOffset} Weeks Ahead
                </Badge>
              )}
            </div>
            <Badge variant="outline" className="px-3 py-1">
              Total Hours: {calculateWeeklyTotal()}
            </Badge>
          </div>
        </CardHeader>
        <div className="px-6 pb-4 flex justify-between items-center">
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
          <Button variant="outline" size="sm" className="gap-1 h-8" onClick={resetToCurrentWeek}>
            <CalendarIcon className="h-3.5 w-3.5" />
            Current Week
          </Button>
        </div>
        <CardContent>
          {/* Timesheet Header */}
          <div className="grid grid-cols-12 gap-2 bg-muted/50 rounded-md p-6 mb-4 font-medium text-sm">
            {/* Project Column */}
            <div className="col-span-4 pl-3 flex items-center">
              <span className="font-bold">Project</span>
            </div>

            {/* Time Code Column */}
            <div className="col-span-1 pl-3 flex items-center">
              <span className="font-bold">Code</span>
            </div>

            {/* Weekday Columns */}
            {weekDates.map((date, index) => (
              <div key={index} className="pl-2 py-1">
                <div className="text-muted-foreground text-xs text-left mb-1">
                  {formatDayName(date)}
                </div>
                <div className="font-semibold text-left flex items-center">
                  <span>{formatMonthDay(date)}</span>
                  {isToday(date) && (
                    <span className="ml-1.5 h-2 w-2 rounded-full bg-blue-500 inline-block"></span>
                  )}
                </div>
              </div>
            ))}

            {/* Week Total Column */}
            <div className="pl-2 py-1">
              <div className="text-muted-foreground text-xs text-left mb-1.5">
                Week
              </div>
              <div className="font-semibold text-left">
                Total
              </div>
            </div>

            {/* Actions Column */}
            <div className="pl-2 py-1 flex justify-center">
              <span className="sr-only">Actions</span>
            </div>
          </div>

          {/* Timesheet Rows */}
          <div className="space-y-2">
            {timesheetData.map((entry) => (
              <div key={entry.id} className="grid grid-cols-12 gap-2 items-center hover:bg-muted/25 rounded-md p-2 transition-colors">
                {/* Project Column */}
                <div className="col-span-4 flex items-center gap-1">
                  {editingProject === entry.id ? (
                    <Popover open={comboboxOpen} onOpenChange={(open) => {
                      setComboboxOpen(open);
                      if (!open) handleProjectBlur();
                    }}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={comboboxOpen}
                          className="justify-between w-full h-8"
                          autoFocus
                        >
                          {entry.projectName !== "Click to select a project" ? entry.projectName : "Select a project"}
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
                                  handleProjectChange(entry.id, project.id)
                                }}
                              >
                                <span>{project.name}</span>
                                <span className="ml-2 text-xs text-muted-foreground">
                                  {project.code}
                                </span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <div
                      className="flex-1 cursor-pointer hover:bg-muted/50 rounded px-2"
                      onClick={() => handleProjectClick(entry.id)}
                    >
                      <div className="font-medium flex items-center gap-2">
                        <span>{entry.projectName}</span>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        {entry.projectCode && (
                          <>
                            <span>{entry.projectCode}</span>
                            {entry.client && (
                              <>
                                <span className="mx-1">•</span>
                                <span>{entry.client}</span>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Time Code Column */}
                <div className="col-span-1 flex items-center">
                  {editingTimeCode === entry.id ? (
                    <Popover open={timeCodeComboboxOpen} onOpenChange={(open) => {
                      setTimeCodeComboboxOpen(open);
                      if (!open) handleTimeCodeBlur();
                    }}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={timeCodeComboboxOpen}
                          className="justify-between w-full h-8"
                          autoFocus
                        >
                          {entry.timeCode ?
                            allTimeCodes.find(c => c.id === entry.timeCode)?.id || "Select"
                            : "Select"}
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
                                      handleTimeCodeChange(entry.id, code.id)
                                    }}
                                    className="pl-6"
                                  >
                                    <span className="font-medium">{code.id}</span>
                                    <span className="ml-2 text-xs">
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
                                        handleTimeCodeChange(entry.id, code.id)
                                      }}
                                      className="pl-6"
                                    >
                                      <span className="font-medium">{code.id}</span>
                                      <span className="ml-2 text-xs">
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
                      onClick={() => handleTimeCodeClick(entry.id)}
                    >
                      {entry.timeCode ? (
                        <div className="flex items-center gap-1 text-sm">
                          <span className="font-medium">{entry.timeCode}</span>
                          {entry.timeCodeName && (
                            <span className="text-muted-foreground text-xs truncate max-w-[70px]">
                              {entry.timeCodeName}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">Select code</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Weekday Input Columns */}
                {weekDates.map((date, index) => {
                  const dayKey = dayjs(date).format("YYYY-MM-DD")
                  const isEditing = isEditingCell(entry.id, dayKey);
                  const hours = entry.hours[dayKey] || 0;

                  return (
                    <div key={index} className="text-left pl-2">
                      {isEditing ? (
                        <Input
                          type="number"
                          min="0"
                          max="24"
                          className="h-8 w-16 text-left pl-2"
                          value={hours}
                          autoFocus
                          onBlur={handleCellBlur}
                          onChange={(e) => handleHoursChange(entry.projectId, dayKey, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCellBlur();
                          }}
                        />
                      ) : (
                        <div
                          className="h-8 flex items-center cursor-pointer hover:bg-muted/50 rounded px-2 w-16"
                          onClick={() => handleCellClick(entry.id, dayKey)}
                        >
                          {hours > 0 ? hours : '-'}
                        </div>
                      )}
                    </div>
                  )
                })}

                {/* Week Total Column */}
                <div className="text-left pl-2">
                  <div className="font-semibold h-8 flex items-center px-2">
                    {calculateProjectTotal(entry.projectId)}
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
                        className="text-destructive focus:text-destructive flex items-center cursor-pointer"
                        onClick={() => handleDeleteRow(entry.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>

          {/* Daily Totals Row */}
          <Separator className="my-4" />
          <div className="grid grid-cols-12 gap-2 items-center font-medium bg-muted/30 p-2 rounded-md">
            {/* Project Column (Daily Totals label) */}
            <div className="col-span-4 pl-3 font-bold text-sm">Totals</div>

            {/* Time Code Column (empty for totals) */}
            <div className="col-span-1"></div>

            {/* Weekday Total Columns */}
            {weekDates.map((date, index) => (
              <div key={index} className="text-left pl-2">
                <div className="h-8 flex items-center px-2">
                  {calculateDailyTotal(date)}
                </div>
              </div>
            ))}

            {/* Week Total Column */}
            <div className="text-left pl-2">
              <div className="h-8 flex items-center font-bold px-2">
                {calculateWeeklyTotal()}
              </div>
            </div>

            {/* Empty cell for actions column */}
            <div></div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <p className="text-sm text-muted-foreground">
            Enter hours for each project (limit: 24 hours per day)
          </p>
          <Button onClick={handleAddEntry} variant="outline" className="gap-1">
            <PlusCircle className="h-4 w-4" />
            Add Project
          </Button>
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  )
}
