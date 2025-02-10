import { AppSidebar } from "@/components/app-sidebar";
import { BreadcrumbNav } from "@/components/breadcrumb";
import {
  SidebarInset,
  SidebarProvider
} from "@/components/ui/sidebar";
import type { Metadata } from "next";
import "./globals.css";

import { Outfit } from "next/font/google";

const font = Outfit({
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
    <html lang="en">
      <body className={`${font.className} antialiased`}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center px-8">
              <BreadcrumbNav />
            </header>
            <main className="py-4 px-8">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
