"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import dayjs from "dayjs"
import isBetween from "dayjs/plugin/isBetween"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import { CalendarDays, Check, ChevronLeft, ChevronRight, Clock, Edit, FileText, MoreHorizontal, Plus, Trash2 } from "lucide-react"
import React, { useState } from "react"

// Register the plugins
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.extend(isBetween)

// Example holiday data
const holidayStats = {
  total: 28,
  used: 14,
  planned: 6,
  remaining: 8,
  pendingApproval: 2
}

const requestsData = [
  {
    id: "req-001",
    startDate: new Date(2024, 6, 15), // July 15, 2024
    endDate: new Date(2024, 6, 22),   // July 22, 2024
    days: 6,
    status: "approved",
    type: "vacation",
    note: "Summer vacation",
    approver: {
      name: "Emily Chen",
      avatar: "/avatars/emily.png",
      initials: "EC"
    }
  },
  {
    id: "req-002",
    startDate: new Date(2024, 9, 21), // October 21, 2024
    endDate: new Date(2024, 9, 25),   // October 25, 2024
    days: 5,
    status: "pending",
    type: "vacation",
    note: "Fall break",
    approver: null
  },
  {
    id: "req-003",
    startDate: new Date(2024, 11, 27), // December 27, 2024
    endDate: new Date(2025, 0, 3),     // January 3, 2025
    days: 5,
    status: "planned",
    type: "vacation",
    note: "Holiday season break",
    approver: null
  }
]

// Generate example holiday dates for the calendar
const holidayDates = [
  // Approved holidays
  { date: new Date(2024, 3, 1), status: "approved" }, // April 1
  { date: new Date(2024, 3, 2), status: "approved" },
  { date: new Date(2024, 3, 3), status: "approved" },
  { date: new Date(2024, 3, 4), status: "approved" },
  { date: new Date(2024, 3, 5), status: "approved" },

  // Past holidays
  { date: new Date(2024, 1, 12), status: "approved" }, // February 12
  { date: new Date(2024, 1, 13), status: "approved" },
  { date: new Date(2024, 1, 14), status: "approved" },

  // Upcoming approved holidays
  { date: new Date(2024, 6, 15), status: "approved" }, // July 15-22 (from requests)
  { date: new Date(2024, 6, 16), status: "approved" },
  { date: new Date(2024, 6, 17), status: "approved" },
  { date: new Date(2024, 6, 18), status: "approved" },
  { date: new Date(2024, 6, 19), status: "approved" },
  { date: new Date(2024, 6, 22), status: "approved" },

  // Pending holidays
  { date: new Date(2024, 9, 21), status: "pending" }, // October 21-25 (from requests)
  { date: new Date(2024, 9, 22), status: "pending" },
  { date: new Date(2024, 9, 23), status: "pending" },
  { date: new Date(2024, 9, 24), status: "pending" },
  { date: new Date(2024, 9, 25), status: "pending" },

  // Planned holidays
  { date: new Date(2024, 11, 27), status: "planned" }, // December 27 - January 3 (from requests)
  { date: new Date(2024, 11, 28), status: "planned" },
  { date: new Date(2024, 11, 29), status: "planned" },
  { date: new Date(2024, 11, 30), status: "planned" },
  { date: new Date(2024, 11, 31), status: "planned" },
  { date: new Date(2025, 0, 1), status: "planned" },
  { date: new Date(2025, 0, 2), status: "planned" },
  { date: new Date(2025, 0, 3), status: "planned" }
]

// Holiday request columns for DataTable
type HolidayRequest = typeof requestsData[0]

const holidayRequestColumns: ColumnDef<HolidayRequest>[] = [
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge
          className={cn(
            "capitalize",
            status === "approved" && "bg-green-500/15 text-green-600 hover:bg-green-500/20 hover:text-green-600",
            status === "pending" && "bg-amber-500/15 text-amber-600 hover:bg-amber-500/20 hover:text-amber-600",
            status === "planned" && "bg-blue-500/15 text-blue-600 hover:bg-blue-500/20 hover:text-blue-600"
          )}
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "note",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Date" />
    ),
    cell: ({ row }) => {
      return dayjs(row.getValue("startDate")).format("MMM D, YYYY")
    },
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End Date" />
    ),
    cell: ({ row }) => {
      return dayjs(row.getValue("endDate")).format("MMM D, YYYY")
    },
  },
  {
    accessorKey: "days",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Days" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const request = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(request.id)}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            {request.status === "pending" && (
              <DropdownMenuItem>
                <Trash2 className="mr-2 h-4 w-4" /> Cancel
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

// Statistics card for holiday overview
function HolidayStatCard({ title, value, icon: Icon, description, className }: {
  title: string;
  value: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description?: string;
  className?: string;
}) {
  return (
    <Card className={cn("flex flex-col justify-between", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className="rounded-full bg-primary/10 p-2">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  )
}

// Main Holidays Dashboard Page
export default function HolidaysDashboard() {
  const [year, setYear] = useState<number>(new Date().getFullYear())

  // Function to check if a date is a holiday and return its status
  const getHolidayStatus = (date: Date) => {
    const holiday = holidayDates.find(h => dayjs(h.date).isSame(date, "day"))
    return holiday ? holiday.status : null
  }

  // Handle year navigation for the yearly view
  const navigateYear = (direction: number) => {
    setYear(year + direction)
  }

  return (
    <div className="flex flex-1 flex-col space-y-8 pb-40">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Holidays</h1>
        <p className="text-muted-foreground">
          Manage your time off and request leave.
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Request
        </Button>
        <Button variant="outline" className="gap-2">
          <FileText className="h-4 w-4" />
          View Policy
        </Button>
      </div>

      {/* Holiday statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <HolidayStatCard
          title="TOTAL ALLOWANCE"
          value={holidayStats.total}
          icon={CalendarDays}
          description="Annual holiday entitlement"
        />
        <HolidayStatCard
          title="DAYS USED"
          value={holidayStats.used}
          icon={Check}
          description="Holidays taken this year"
        />
        <HolidayStatCard
          title="PLANNED DAYS"
          value={holidayStats.planned}
          icon={Clock}
          description="Upcoming approved & planned"
        />
        <HolidayStatCard
          title="REMAINING"
          value={holidayStats.remaining}
          icon={Plus}
          description="Available days to take"
        />
      </div>

      {/* Monthly Calendar View */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Yearly Overview</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => navigateYear(-1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-semibold">{year}</span>
              <Button variant="outline" size="icon" onClick={() => navigateYear(1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {/* Generate 12 months */}
            {Array.from({ length: 12 }).map((_, i) => {
              const monthDate = new Date(year, i, 1)
              const monthName = dayjs(monthDate).format("MMM")

              // Get all days in this month
              const days = []
              const currentDate = new Date(year, i, 1)
              while (currentDate.getMonth() === i) {
                days.push(new Date(currentDate))
                currentDate.setDate(currentDate.getDate() + 1)
              }

              return (
                <div key={i} className="space-y-2 border rounded-md p-2">
                  <div className="text-center text-sm font-medium border-b pb-1">{monthName}</div>

                  {/* Weekday headers */}
                  <div className="grid grid-cols-7 gap-0.5 text-center text-[0.6rem] text-muted-foreground">
                    {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
                      <div key={`day-${idx}`} className="h-4">{day}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-0.5 text-center text-xs">
                    {/* Empty slots for days before month starts */}
                    {Array.from({ length: new Date(year, i, 1).getDay() }).map((_, idx) => (
                      <div key={`empty-${idx}`} className="aspect-square"></div>
                    ))}

                    {/* Actual days */}
                    {days.map((day, idx) => {
                      const holidayStatus = getHolidayStatus(day)
                      const isToday = dayjs(day).isSame(new Date(), "day")
                      return (
                        <div
                          key={idx}
                          className={cn(
                            "flex aspect-square items-center justify-center border text-[0.65rem]",
                            holidayStatus === "approved" && "bg-green-500/15 text-green-600",
                            holidayStatus === "pending" && "bg-amber-500/15 text-amber-600",
                            holidayStatus === "planned" && "bg-blue-500/15 text-blue-600",
                            isToday && "bg-accent font-bold ring-1 ring-primary"
                          )}
                        >
                          {day.getDate()}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500/15"></div>
              <span className="text-xs">Approved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-amber-500/15"></div>
              <span className="text-xs">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500/15"></div>
              <span className="text-xs">Planned</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-accent"></div>
              <span className="text-xs">Today</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* My Holiday Requests Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>My Holiday Requests</CardTitle>
          <CardDescription>Manage your holiday requests and approvals</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={holidayRequestColumns} data={requestsData} />
        </CardContent>
      </Card>
    </div>
  )
}
