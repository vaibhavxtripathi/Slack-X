import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetWorkspaces } from "@/features/workspaces/api/useGetWorkspaces";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useGetWorkspace } from "@/features/workspaces/api/useGetWorkspace";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/useCreateWorkspaceModal";
import { useRouter } from "next/navigation";

export const WorkspaceSwitcher = () => {
  const workspaceId = useWorkspaceId();
  const [, setIsOpen] = useCreateWorkspaceModal();
  const router = useRouter();
  const { data: workspaces } = useGetWorkspaces();
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });

  const filteredWorkspaces = workspaces?.filter(
    (workspace) => workspace?._id !== workspaceId
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="mb-2 size-9 relative overflow-hidden bg-[#ABABAD] hover:bg-[#ababa]/80 text-slate-800 font-semibold text-xl">
          {workspaceLoading ? (
            <Loader color="white" className="size-5 animate-spin shrink-0" />
          ) : (
            workspace?.name?.charAt(0).toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="w-64">
        <DropdownMenuItem
          className="cursor-pointer flex-col  justitfy-start items-start capitalize"
          onClick={() => {
            router.push(`/workspace/${workspaceId}`);
          }}
        >
          <div className="font-semibold">{workspace?.name} workspace</div>
          <span className="text-xs text-muted-foreground">
            Active workspace
          </span>
        </DropdownMenuItem>
        {filteredWorkspaces?.map((workspace) => (
          <DropdownMenuItem
            key={workspace?._id}
            className="cursor-pointer capitalize overflow-hidden"
            onClick={() => {
              router.push(`/workspace/${workspace?._id}`);
            }}
          >
            <div className="shrink-0 size-9 realtive overflow-hidden bg-[#616061] text-white font-semibold text-xl rounded-md flex items-center justify-center mr-2">
              {workspace.name.charAt(0).toUpperCase()}
            </div>
            <div className="truncate">{workspace?.name}</div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <div className="size-9 realtive overflow-hidden bg-[#f2f2f2] text-slate-800 font-semibold text-xl rounded-md flex items-center justify-center mr-2">
            <Plus />
          </div>
          <span className="text-[15px] font-semibold">Add a new workspace</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
