"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useCreateWorkspaceModal } from "../store/useCreateWorkspaceModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateWorkspace } from "../api/useCreateWorkspaces";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const CreateWorkspaceModal = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useCreateWorkspaceModal();
  const [name, setName] = useState("");

  const { mutate, isPending } = useCreateWorkspace();

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    mutate(
      { name },
      {
        onSuccess: (id) => {
          toast.success("Workspace created successfully.");
          router.push(`/workspace/${id}`);
          setIsOpen(false);
        },
        onError: (error) => {
          toast.error("Failed to create workspace, please try again.");
          console.error(error);
        },
      }
    );
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Workspace</DialogTitle>
          <DialogDescription>
            Create a new workspace to start collaborating with your team.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              minLength={3}
              disabled={isPending}
              maxLength={20}
              type="text"
              placeholder="Workspace Name e.g. 'Work', 'Personal', 'Project 1'"
            />
          </form>
        </DialogFooter>
        <div className="flex justify-end gap-2">
          <Button onClick={handleSubmit} disabled={isPending}>
            Create Workspace
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
