"use client"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

interface Tab {
  value: string
  label: string
  content: React.ReactNode
}

interface PageTabsProps {
  defaultValue: string
  tabs: Tab[]
}

export function PageTabs({ defaultValue, tabs }: PageTabsProps) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue={defaultValue} className="w-full">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="mt-6">
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {tab.content}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  )
}