"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  Calendar,
  CalendarCheck,
  Clock,
  FileQuestion,
  Plane,
  Umbrella,
  Vote
} from "lucide-react"
import Link from "next/link"

// Minimal status indicator component for holiday status
function HolidayStatusItem({
  icon: Icon,
  label,
  value,
  className
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string | number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className="text-lg font-semibold">{value}</span>
      </div>
    </div>
  )
}

// Card for displaying upcoming holiday
function UpcomingHolidayCard({
  upcomingHoliday = null
}: {
  upcomingHoliday?: {
    startDate: string;
    endDate: string;
    daysCount: number;
    location?: string;
    description?: string;
    status: "approved" | "pending";
    approver?: {
      name: string;
      avatarUrl?: string;
      initials: string;
    };
  } | null
}) {
  if (!upcomingHoliday) {
    return (
      <Card className="flex h-[225px] flex-col items-center justify-center p-6 text-center">
        <div className="mb-3 rounded-full bg-muted p-3">
          <Umbrella className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-sm font-medium">No Upcoming Holiday</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          You don&apos;t have any planned leave coming up
        </p>
        <Button asChild variant="outline" size="sm" className="mt-4">
          <Link href="/holidays/new">
            Schedule Leave
          </Link>
        </Button>
      </Card>
    )
  }

  const { startDate, endDate, daysCount, location, description, status, approver } = upcomingHoliday

  return (
    <Card className="h-[225px] p-6">
      <div className="flex h-full flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Plane className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-medium">Next Holiday</h3>
            </div>
            <div className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium",
              status === "approved" ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"
            )}>
              {status === "approved" ? "Approved" : "Pending"}
            </div>
          </div>

          <div className="mt-6 space-y-1">
            <div className="text-xl font-bold">
              {startDate} - {endDate}
            </div>
            <div className="text-xs text-muted-foreground">
              {description || (location && `Beach getaway at ${location}`)} ({daysCount} days)
            </div>
          </div>
        </div>

        {status === "approved" && approver && (
          <div className="flex items-center gap-2 border-t pt-4">
            <Avatar className="h-7 w-7">
              {approver.avatarUrl && <AvatarImage src={approver.avatarUrl} alt={approver.name} />}
              <AvatarFallback>{approver.initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Approved by</span>
              <span className="text-sm font-medium">{approver.name}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

// Card for displaying pending requests
function PendingRequestsCard() {
  return (
    <Card className="flex h-[225px] flex-col items-center justify-center p-6 text-center">
      <div className="mb-3 rounded-full bg-muted p-3">
        <FileQuestion className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-sm font-medium">No Pending Requests</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        You don&apos;t have any pending holiday requests awaiting approval
      </p>
      <Button asChild variant="outline" size="sm" className="mt-4">
        <Link href="/holidays/new">
          Request Leave
        </Link>
      </Button>
    </Card>
  )
}

// Main holiday dashboard section
export function DashboardHolidaySection() {
  // This would come from your API in a real application
  const holidayStatus = {
    yearTotal: 28,
    taken: 12,
    pending: 4,
    available: 12
  }

  // Sample upcoming holiday (can be null)
  const upcomingHoliday = {
    startDate: "2 July",
    endDate: "9 July",
    daysCount: 5,
    location: "Beach Retreat",
    description: "Annual summer vacation in Malibu",
    status: "approved" as const,
    approver: {
      name: "Emily Chen",
      initials: "EC"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Holiday Management</h2>
        <Button asChild variant="outline" size="sm">
          <Link href="/holidays">View All</Link>
        </Button>
      </div>

      {/* Holiday Status Bar */}
      <Card className="py-8 px-6">
        <div className="mb-6 flex items-center gap-2">
          <h3 className="text-sm font-medium">Holiday Allowance <span className="text-muted-foreground">· 2024</span></h3>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <HolidayStatusItem
            icon={Calendar}
            label="YEAR TOTAL"
            value={holidayStatus.yearTotal}
          />
          <HolidayStatusItem
            icon={Vote}
            label="TAKEN"
            value={holidayStatus.taken}
          />
          <HolidayStatusItem
            icon={Clock}
            label="PENDING"
            value={holidayStatus.pending}
          />
          <HolidayStatusItem
            icon={CalendarCheck}
            label="AVAILABLE"
            value={holidayStatus.available}
          />
        </div>
      </Card>

      {/* Holiday Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <UpcomingHolidayCard upcomingHoliday={upcomingHoliday} />
        <PendingRequestsCard />
      </div>
    </div>
  )
}