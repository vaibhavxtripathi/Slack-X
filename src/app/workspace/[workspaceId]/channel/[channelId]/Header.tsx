import { Button } from "@/components/ui/button";
import { FaChevronDown } from "react-icons/fa";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { useUpdateChannel } from "@/features/channels/api/useUpdateChannel";
import { useDeleteChannel } from "@/features/channels/api/useDeleteChannel";
import { useChannelId } from "@/hooks/useChannelId";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/useConfirm";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useCurrentMember } from "@/features/members/api/useCurrentMember";

interface HeaderProps {
  title: string;
}

export const Header = ({ title }: HeaderProps) => {
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const [editOpen, setEditOpen] = useState(false);
  const [value, setValue] = useState(title);

  const { data: member } = useCurrentMember(workspaceId);

  const { mutate: updateChannel, isPending: isUpdating } = useUpdateChannel();
  const { mutate: deleteChannel, isPending: isDeleting } = useDeleteChannel();

  const handleEditOpen = (value: boolean) => {
    if (member?.role !== "admin") return;

    setEditOpen(value);
  };

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete Channel",
    "Are you sure you want to delete this channel?"
  );

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setValue(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateChannel(
      { channelId, name: value },
      {
        onSuccess: () => {
          toast.success("Channel updated");
          setEditOpen(false);
        },
        onError: () => {
          toast.error("Failed to update channel");
        },
      }
    );
  };

  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    deleteChannel(
      { channelId },
      {
        onSuccess: () => {
          toast.success("Channel deleted");
          router.push(`/workspace/${workspaceId}`);
        },
        onError: () => {
          toast.error("Failed to delete channel");
        },
      }
    );
  };

  return (
    <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      <ConfirmDialog />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-lg font-semibold px-2 overflow-hidden w-auto"
          >
            <span className="truncate">{title}</span>
            <FaChevronDown className="size-2.5 ml-auto" />
          </Button>
        </DialogTrigger>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle className="text-lg font-semibold">
              # {title}
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 pb-4 flex flex-col gap-y-2 -mt-3 mb-3">
            <Dialog open={editOpen} onOpenChange={handleEditOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-0.9">
                      <p className="text-sm font-semibold">Channel Name</p>
                      <p className="text-sm"># {title}</p>
                    </div>
                    {member?.role === "admin" && (
                      <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                        Edit
                      </p>
                    )}
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this channel</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <Input
                    value={value}
                    onChange={handleValueChange}
                    disabled={isUpdating}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="e.g. plan-budget"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" disabled={isUpdating}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit" disabled={isUpdating}>
                      Save
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            {member?.role === "admin" && (
              <button
                className="flex border items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer hover:bg-gray-50 text-rose-700"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <TrashIcon className="size-4" />
                <p className="text-sm font-semibold">Delete Channel</p>
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
