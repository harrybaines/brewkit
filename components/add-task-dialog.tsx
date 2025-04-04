"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { AlertOctagon, Bug, CalendarIcon, CheckCircle2, Circle, Clock, FileText, Gauge, Sparkles } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Combobox } from "@/components/ui/combobox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const statusOptions = [
  { value: "TODO", label: "To Do", icon: <Circle className="h-4 w-4 text-slate-500" /> },
  { value: "IN_PROGRESS", label: "In Progress", icon: <Clock className="h-4 w-4 text-blue-500" /> },
  { value: "COMPLETED", label: "Completed", icon: <CheckCircle2 className="h-4 w-4 text-green-500" /> },
  { value: "BLOCKED", label: "Blocked", icon: <AlertOctagon className="h-4 w-4 text-red-500" /> },
]

const priorityOptions = [
  { value: "LOW", label: "Low", icon: <Gauge className="h-4 w-4 text-slate-500" /> },
  { value: "MEDIUM", label: "Medium", icon: <Gauge className="h-4 w-4 text-blue-500" /> },
  { value: "HIGH", label: "High", icon: <Gauge className="h-4 w-4 text-orange-500" /> },
  { value: "URGENT", label: "Urgent", icon: <Gauge className="h-4 w-4 text-red-500" /> },
]

const typeOptions = [
  { value: "FEATURE", label: "Feature", icon: <Sparkles className="h-4 w-4 text-purple-500" /> },
  { value: "BUG", label: "Bug", icon: <Bug className="h-4 w-4 text-red-500" /> },
  { value: "DOCUMENTATION", label: "Documentation", icon: <FileText className="h-4 w-4 text-blue-500" /> },
  { value: "IMPROVEMENT", label: "Improvement", icon: <Sparkles className="h-4 w-4 text-green-500" /> },
]

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED", "BLOCKED"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  type: z.enum(["FEATURE", "BUG", "DOCUMENTATION", "IMPROVEMENT"]),
  dueDate: z.date().optional(),
})

type FormData = z.infer<typeof formSchema>

type AddTaskDialogProps = {
  trigger?: React.ReactNode
  onSubmit: (data: FormData) => void
}

export function AddTaskDialog({ trigger, onSubmit }: AddTaskDialogProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "TODO",
      priority: "MEDIUM",
      type: "FEATURE",
    },
  })

  const handleSubmit = (data: FormData) => {
    onSubmit(data)
    form.reset()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            Add Task
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Create a new task with all the necessary details.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter task description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Combobox
                        options={statusOptions}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <Combobox
                        options={priorityOptions}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Combobox
                        options={typeOptions}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit">Create Task</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}