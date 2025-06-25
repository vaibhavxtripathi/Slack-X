import { useCurrentMember } from "@/features/members/api/useCurrentMember";
import { useGetWorkspace } from "@/features/workspaces/api/useGetWorkspace";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { AlertTriangle, Loader } from "lucide-react";
import WorkspaceHeader from "./WorkspaceHeader";

const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();
  const { data: member, isLoading: isMemberLoading } =
    useCurrentMember(workspaceId);
  const { data: workspace, isLoading: isWorkspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });

  if (isMemberLoading || isWorkspaceLoading) {
    return (
      <div className="flex flex-col bg-[#5e2c5f] h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-white" />
      </div>
    );
  }
  if (!workspace || !member) {
    return (
      <div className="flex flex-col gap-y-2 bg-[#5e2c5f] h-full items-center justify-center">
        <AlertTriangle className="size-5 text-white" />
        <p className="text-white">
          No workspace found.
        </p>
      </div>
    );
  }
    return (
        <div className="flex flex-colbg-[#5e2c5f] h-full">
            <WorkspaceHeader workspace={workspace} isAdmin={member.role === "admin"}/>
      </div>
  );
};

export default WorkspaceSidebar;
