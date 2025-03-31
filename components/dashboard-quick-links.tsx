"use client"

import { cn } from "@/lib/utils"
import {
  ClipboardList,
  Clock,
  FolderPlus,
  PenLine,
  Settings
} from "lucide-react"
import Link from "next/link"

interface QuickLinkProps {
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  title: string
  description: string
  className?: string
}

function QuickLink({ href, icon: Icon, title, description, className }: QuickLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex h-28 items-center gap-4 rounded-xl border bg-card px-6 py-4 transition-all duration-200 hover:bg-accent/30 hover:shadow",
        className
      )}
    >
      <div className="rounded-full bg-primary/10 p-3 text-primary transition-transform duration-200 ease-in-out hover:scale-105">
        <Icon className="h-5 w-5" />
      </div>
      <div className="space-y-0.5">
        <h3 className="font-medium text-sm">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </Link>
  )
}

export function DashboardQuickLinks() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Quick Actions</h2>
        <Link
          href="/settings"
          className="text-xs text-muted-foreground transition-colors duration-200 hover:text-muted-foreground/80 flex items-center gap-1.5"
        >
          <Settings className="h-3.5 w-3.5" />
          <span>Customize</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <QuickLink
          href="/projects/new"
          icon={FolderPlus}
          title="New Project"
          description="Create project"
        />
        <QuickLink
          href="/timesheets"
          icon={Clock}
          title="Timesheets"
          description="Log your hours"
        />
        <QuickLink
          href="/projects"
          icon={PenLine}
          title="Projects"
          description="View all projects"
        />
        <QuickLink
          href="/tasks"
          icon={ClipboardList}
          title="Tasks"
          description="Manage tasks"
        />
      </div>
    </div>
  )
}