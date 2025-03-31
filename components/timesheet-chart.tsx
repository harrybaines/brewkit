"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart"

// Sample timesheet data for the last 6 weeks
const timesheetData = [
  { week: "Week 1", hours: 32.5 },
  { week: "Week 2", hours: 37.2 },
  { week: "Week 3", hours: 40.0 },
  { week: "Week 4", hours: 35.8 },
  { week: "Week 5", hours: 42.5 },
  { week: "Week 6", hours: 38.7 },
]

const chartConfig = {
  hours: {
    label: "Hours",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function TimesheetChart() {
  // Current week's hours (this would come from an API in a real application)
  const currentWeekHours = 22.5

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-4">
        <div className="flex flex-1 flex-col justify-center gap-1">
          <CardTitle>Timesheet Hours</CardTitle>
          <CardDescription>
            Weekly tracked hours history
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 pb-0 pt-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Current Week</p>
            <div className="text-2xl font-bold">{currentWeekHours.toFixed(1)}h</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[hsl(var(--chart-3))]" />
            <span className="text-sm font-medium">Historical Hours</span>
          </div>
        </div>

        <div className="h-[190px]">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart
              data={timesheetData}
              margin={{
                top: 5,
                right: 0,
                left: 0,
                bottom: 20,
              }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
              <XAxis
                dataKey="week"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickMargin={8}
              />
              <YAxis
                hide={true}
                domain={[0, 'dataMax + 5']}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[120px]"
                    labelFormatter={(value) => {
                      return value;
                    }}
                  />
                }
              />
              <Bar
                dataKey="hours"
                fill="var(--color-hours)"
                radius={[4, 4, 0, 0]}
                barSize={28}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}