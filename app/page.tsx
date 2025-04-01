import { AssignedTasksCard } from "@/components/assigned-tasks-card"
import { CreateProjectForm } from "@/components/create-project-form"
import { DashboardHolidaySection } from "@/components/dashboard-holiday-section"
import { DashboardQuickLinks } from "@/components/dashboard-quick-links"
import { TimesheetChart } from "@/components/timesheet-chart"
import { buttonVariants } from "@/components/ui/button"
import { Clock } from "lucide-react"
import Link from "next/link"

export default function Page() {
  return (
    <div className="flex flex-1 flex-col space-y-8 pb-40">
      {/* Header Section */}
      <div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">Manage your projects in one place.</p>
        </div>

        <div className="mt-4 flex gap-1.5">
          <CreateProjectForm />
          <Link href="/projects" className={buttonVariants({ variant: "outline" })}>
            View Projects
          </Link>
        </div>
      </div>

      {/* Quick Links Section */}
      <DashboardQuickLinks />

      {/* Stat Cards Grid */}
      {/* <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Projects</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 since last month
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Hours Tracked</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="text-2xl font-bold">124.5</div>
            <p className="text-xs text-muted-foreground">
              +20.1h from last week
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Active Tasks</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              4 due today
            </p>
          </div>
        </div>
      </div> */}

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <TimesheetChart />
        </div>

        <div className="col-span-2 rounded-lg border bg-card p-5">
          <div className="flex items-center gap-1.5 mb-3">
            <Clock className="h-3.5 w-3.5 text-blue-500" />
            <h3 className="text-base font-medium">My In-Progress Tasks</h3>
          </div>
          <AssignedTasksCard />
        </div>
      </div>

      {/* Holiday Management Section */}
      <DashboardHolidaySection />

    </div>
  )
}
