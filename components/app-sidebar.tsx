"use client"

import {
  Home,
  PenIcon,
  Settings,
  User
} from "lucide-react"
import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
    },
    {
      title: "Projects",
      url: "/projects",
      icon: PenIcon
    },
    {
      title: "Account",
      url: "/account",
      icon: User
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings
    },
  ],
  user: {
    name: "Harry Baines",
    email: "name@email.com",
  },
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" className="border-none" {...props}>
      <SidebarHeader className="px-6 py-[18px]">
        <span className="text-lg font-semibold">Brewkit</span>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="mt-auto">
        <div className="p-4 mt-auto border-t">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>NA</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{data.user.name}</span>
              <span className="text-xs text-muted-foreground">{data.user.email}</span>
            </div>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
