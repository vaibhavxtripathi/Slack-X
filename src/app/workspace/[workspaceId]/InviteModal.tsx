import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useNewJoinCode } from "@/features/workspaces/api/useNewJoincode";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { CopyIcon, RefreshCcwIcon } from "lucide-react";
import { toast } from "sonner";

interface InviteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  joinCode: string;
}

export const InviteModal = ({
  open,
  setOpen,
  name,
  joinCode,
}: InviteModalProps) => {
  const workspaceId = useWorkspaceId();
  const inviteLink = `${window.location.origin}/join/${workspaceId}`;

  const { mutate, isPending } = useNewJoinCode();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite people to {name}</DialogTitle>
          <DialogDescription>
            Use the code below to invite people to your workspace.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-y-4 items-center justify-center py-2">
          <div className="flex flex-col items-center gap-y-4">
            <p className="font-semibold text-4xl text-center uppercase tracking-widest">
              {joinCode}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(inviteLink);
                toast.success("Invite link copied to clipboard");
              }}
            >
              Copy link
              <CopyIcon className="size-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between w-full">
          <Button
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => {
              mutate({ workspaceId });
            }}
          >
            New code
            <RefreshCcwIcon className="size-4" />
          </Button>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
