"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useState } from "react";
import { projectsData } from "../data";

interface CopyLastWeekDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCopy: (selectedProjectIds: number[]) => void;
}

export const CopyLastWeekDialog: React.FC<CopyLastWeekDialogProps> = ({
  open,
  onOpenChange,
  onCopy,
}) => {
  // In a real implementation, these would be the actual entries from last week
  // For now, we'll use sample data
  const lastWeekProjects = projectsData.slice(0, 4).map(project => ({
    id: project.id,
    projectCode: project.code,
    projectName: project.name,
    timeCode: "1", // Example time code
    timeCodeName: "Design", // Example time code name
  }));

  const [selectedProjects, setSelectedProjects] = useState<Record<number, boolean>>(
    lastWeekProjects.reduce((acc, project) => {
      acc[project.id] = true; // All selected by default
      return acc;
    }, {} as Record<number, boolean>)
  );

  const handleToggleProject = (projectId: number) => {
    setSelectedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const handleToggleAll = () => {
    const allSelected = Object.values(selectedProjects).every(Boolean);
    const newValue = !allSelected;

    const updatedSelections = lastWeekProjects.reduce((acc, project) => {
      acc[project.id] = newValue;
      return acc;
    }, {} as Record<number, boolean>);

    setSelectedProjects(updatedSelections);
  };

  const selectedCount = Object.values(selectedProjects).filter(Boolean).length;
  const allSelected = selectedCount === lastWeekProjects.length;

  const handleCopy = () => {
    const selectedProjectIds = Object.entries(selectedProjects)
      .filter(([, isSelected]) => isSelected)
      .map(([id]) => Number(id));

    onCopy(selectedProjectIds);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Copy from Last Week</DialogTitle>
          <DialogDescription>
            Select the entries you want to copy from last week to this week.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between py-2 border-b mb-3">
          <div className="text-sm">
            <span className="font-medium">{selectedCount}</span> of <span>{lastWeekProjects.length}</span> entries selected
          </div>
          <div className="flex items-center cursor-pointer" onClick={handleToggleAll}>
            <Checkbox
              id="select-all"
              checked={allSelected}
              onCheckedChange={handleToggleAll}
              className="flex-shrink-0"
            />
            <label htmlFor="select-all" className="ml-2 text-xs cursor-pointer">
              {allSelected ? "Deselect All" : "Select All"}
            </label>
          </div>
        </div>

        {/* Column Headers */}
        <div className="grid grid-cols-[1fr_1fr_auto] gap-x-4 px-3 py-2 mb-2 bg-muted/40 rounded-sm text-xs font-medium text-muted-foreground">
          <div>Project</div>
          <div>Code</div>
          <div className="ml-6 text-center"></div>
        </div>

        <ScrollArea className="max-h-[400px] pr-4 -mr-4">
          <div className="space-y-3 py-1">
            {lastWeekProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between border rounded-md p-3 hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => handleToggleProject(project.id)}
              >
                <div className="grid grid-cols-[1fr_1fr] gap-x-6 w-full items-center">
                  {/* Project */}
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs px-1.5 py-0 bg-white w-auto text-center flex-shrink-0">
                      {project.projectCode}
                    </Badge>
                    <div className="font-medium text-sm truncate">
                      {project.projectName}
                    </div>
                  </div>

                  {/* Time Code */}
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs px-1.5 py-0 bg-white w-auto text-center flex-shrink-0">
                      {project.timeCode}
                    </Badge>
                    <div className="text-xs text-muted-foreground truncate">
                      {project.timeCodeName}
                    </div>
                  </div>
                </div>

                <div className="flex items-center ml-6 min-w-[60px] justify-center" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    id={`project-${project.id}`}
                    checked={selectedProjects[project.id]}
                    onCheckedChange={() => handleToggleProject(project.id)}
                    className="flex-shrink-0"
                  />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="flex items-center justify-between mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCopy}>
            Copy Selected
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};