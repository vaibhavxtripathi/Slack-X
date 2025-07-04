import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useCreateChannelModal } from "../store/useCreateChannelModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateChannel } from "../api/useCreateChannel";
import { useState } from "react";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const CreateChannelModal = () => {
  const [isOpen, setIsOpen] = useCreateChannelModal();
  const [name, setName] = useState("");
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const { mutate, isPending } = useCreateChannel();

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Channel name is required");
      return;
    }

    mutate(
      { name, workspaceId },
      {
        onSuccess: (id) => {
          toast.success("Channel created successfully");
          setIsOpen(false);
          setName("");
          router.push(`/workspace/${workspaceId}/channel/${id}`);
        },
        onError: (error) => {
          toast.error("Failed to create channel, please try again");
          console.error(error);
        },
      }
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setName(value);
  };

  const handleClose = () => {
    setIsOpen(false);
    setName("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Channel</DialogTitle>
          <DialogDescription>
            Create a new channel to collaborate with your team.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <Input
              value={name}
              onChange={handleChange}
              autoFocus
              minLength={1}
              disabled={isPending}
              maxLength={20}
              type="text"
              placeholder="Channel name e.g. 'general', 'random', 'project-1'"
            />
          </form>
        </DialogFooter>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            Create Channel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
