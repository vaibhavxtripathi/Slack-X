import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useState } from "react";
import { TrashIcon } from "lucide-react";
import { useUpdateWorkspace } from "@/features/workspaces/api/useUpdateWorkspaces";
import { useDeleteWorkspace } from "@/features/workspaces/api/useDeleteWorkspaces";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/useConfirm";

interface PreferencesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValue: string;
}

export const PreferencesModal = ({
  open,
  onOpenChange,
  initialValue,
}: PreferencesModalProps) => {
  const [workspaceName, setWorkspaceName] = useState(initialValue);
  const [inputValue, setInputValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);

  const { mutate: updateWorkspaceName, isPending: isUpdatingWorkspaceName } =
    useUpdateWorkspace();
  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
    useDeleteWorkspace();

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete workspace",
    "Are you sure you want to delete this workspace?"
  );

  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const handleEditOpen = () => {
    setInputValue(workspaceName);
    setIsEditing(true);
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateWorkspaceName(
      { id: workspaceId, name: inputValue },
      {
        onSuccess: () => {
          toast.success("Workspace updated");
          setWorkspaceName(inputValue);
          setIsEditing(false);
        },
        onError: (error) => {
          toast.error("Failed to update workspace");
        },
      }
    );
  };

  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    deleteWorkspace(
      { id: workspaceId },
      {
        onSuccess: () => {
          toast.success("Workspace deleted");
          router.replace("/");
        },
        onError: (error) => {
          toast.error("Failed to delete workspace");
        },
      }
    );
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="p-0 bg-background overflow-hidden">
          <DialogHeader className="p-4 border-b bg-background">
            <DialogTitle className="capitalize">{workspaceName}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <div
                  className="px-5 py-4 bg-background rounded-lg border cursor-pointer hover:bg-hover"
                  onClick={handleEditOpen}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-0.9">
                      <p className="text-sm font-semibold">Workspace name</p>
                      <p className="text-sm text-muted-foregroun capitalize">
                        {workspaceName}
                      </p>
                    </div>
                    <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                      Edit
                    </p>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit workspace name</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleEdit} className="space-y-4">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={isUpdatingWorkspaceName}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={50}
                    placeholder="Workspace Name e.g. 'Work', 'Personal', 'Project 1'"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        variant="outline"
                        disabled={isUpdatingWorkspaceName}
                        type="button"
                        onClick={() => setInputValue(workspaceName)}
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button disabled={isUpdatingWorkspaceName} type="submit">
                      Save
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <button
              className="flex items-center gap-x-2 px-5 py-4 bg-background rounded-lg border cursor-pointer hover:bg-hover text-red-600"
              onClick={handleDelete}
              disabled={isDeletingWorkspace}
            >
              <TrashIcon className="size-4" />
              <p className="text-sm font-semibold">Delete workspace</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
