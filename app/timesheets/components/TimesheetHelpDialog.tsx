"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";

export const TimesheetHelpDialog: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
        >
          Help
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>How to Complete Your Timesheet</DialogTitle>
          <DialogDescription>
            A quick guide to recording and submitting your time
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <h3 className="text-sm font-medium mb-1">Adding Time Entries</h3>
            <p className="text-sm text-muted-foreground">
              Click the &ldquo;Add Entry&rdquo; button at the bottom to create a new row.
              Select a project and appropriate time code, then enter your hours for each day.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">Selecting Projects</h3>
            <p className="text-sm text-muted-foreground">
              Click on the empty project cell to open a dropdown of available projects.
              Search or scroll to find your project and click to select it.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">Time Codes</h3>
            <p className="text-sm text-muted-foreground">
              Each project requires a valid time code. Click the code cell to select from
              available options. Different projects may have different permitted time codes.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">Recording Hours</h3>
            <p className="text-sm text-muted-foreground">
              Click on any day cell to enter hours. Use increments of 0.5 hours (30 minutes).
              Tab or click away to save the entry.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">Adding Comments</h3>
            <p className="text-sm text-muted-foreground">
              To add notes or clarification to an entry, click the comment icon next to the project details.
              Comments are visible to approvers and can provide context for your time entries.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">Navigating Weeks</h3>
            <p className="text-sm text-muted-foreground">
              Use the left and right arrows to move between weeks. The home button returns
              you to the current week. You can submit time for past or future weeks.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">Submitting Your Timesheet</h3>
            <p className="text-sm text-muted-foreground">
              Click &ldquo;Save&rdquo; to save your work in progress. When your timesheet is complete,
              click &ldquo;Submit&rdquo; to send it for approval. Submitted timesheets cannot be edited.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};