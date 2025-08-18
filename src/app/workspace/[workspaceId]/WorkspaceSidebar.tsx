import { useCurrentMember } from "@/features/members/api/useCurrentMember";
import { useGetWorkspace } from "@/features/workspaces/api/useGetWorkspace";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizonal,
} from "lucide-react";
import WorkspaceHeader from "./WorkspaceHeader";
import { SidebarItem } from "./SidebarItem";
import { useGetChannels } from "@/features/channels/api/useGetChannels";
import { WorkspaceSection } from "./WorkspaceSection";
import { useGetMembers } from "@/features/members/api/useGetMembers";
import { UserItem } from "./UserItem";
import { useCreateChannelModal } from "@/features/channels/store/useCreateChannelModal";
import { useChannelId } from "@/hooks/useChannelId";
import { useMemberId } from "@/hooks/useMemberId";

const WorkspaceSidebar = () => {
  const channelId = useChannelId();
  const memberId = useMemberId();
  const workspaceId = useWorkspaceId();
  const { data: member, isLoading: isMemberLoading } =
    useCurrentMember(workspaceId);
  const { data: workspace, isLoading: isWorkspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: channels } = useGetChannels({
    workspaceId,
  });
  const { data: members } = useGetMembers(workspaceId);

  const [_isOpen, setIsOpen] = useCreateChannelModal();

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
        <p className="text-white">No workspace found.</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col bg-[#5e2c5f] h-full">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />
      <div className="flex flex-col px-2 mt-3">
        <SidebarItem
          label="Threads"
          icon={MessageSquareText}
          variant="default"
        />
        <SidebarItem
          label="Drafts & Sent"
          icon={SendHorizonal}
          variant="default"
        />
      </div>
      <WorkspaceSection
        label="Channels"
        hint="New channel"
        onNew={() => setIsOpen(true)}
      >
        {channels?.map((item) => (
          <SidebarItem
            key={item._id}
            label={item.name}
            icon={HashIcon}
            id={item._id}
            variant={channelId === item._id ? "active" : "default"}
          />
        ))}
      </WorkspaceSection>
      <WorkspaceSection
        label="Direct Messages"
        hint="New direct message"
        onNew={() => {}}
      >
        {members?.map((member) => (
          <UserItem
            key={member._id}
            id={member._id}
            label={member.user?.name}
            image={member.user?.image}
            variant={memberId === member._id ? "active" : "default"}
          />
        ))}
      </WorkspaceSection>
    </div>
  );
};

export default WorkspaceSidebar;
