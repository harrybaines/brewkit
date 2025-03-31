import { AppSidebar } from "@/components/app-sidebar";
import { BreadcrumbNav } from "@/components/breadcrumb";
import { DashboardHeaderWrapper } from "@/components/dashboard-header-wrapper";
import { ModeToggle } from "@/components/mode-toggle";
import {
  SidebarInset,
  SidebarProvider
} from "@/components/ui/sidebar";
import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { Parkinsans } from 'next/font/google';

const font = Parkinsans({
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Brewkit",
  description: "Project management and time tracking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={font.className}>
      <body>
        <ThemeProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center">
                <DashboardHeaderWrapper>
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-4">
                      <BreadcrumbNav />
                    </div>
                    <ModeToggle />
                  </div>
                </DashboardHeaderWrapper>
              </header>
              <div className="py-6">
                <DashboardHeaderWrapper className="py-0">
                  {children}
                </DashboardHeaderWrapper>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
