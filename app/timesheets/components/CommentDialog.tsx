"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";

interface CommentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialComment: string;
  onSave: (comment: string) => void;
  projectName: string;
}

export const CommentDialog: React.FC<CommentDialogProps> = ({
  open,
  onOpenChange,
  initialComment,
  onSave,
  projectName,
}) => {
  const [comment, setComment] = useState<string>(initialComment);

  const handleSave = () => {
    onSave(comment);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Entry Comment</DialogTitle>
          <DialogDescription>
            Add notes or comments for this timesheet entry: {projectName}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Textarea
            className="min-h-[120px]"
            placeholder="Add your comment here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Comment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};