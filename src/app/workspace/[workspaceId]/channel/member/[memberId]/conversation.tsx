import { Loader } from "lucide-react";

import { usePanel } from "@/hooks/usePanel";
import { useMemberId } from "@/hooks/useMemberId";
import { MessageList } from "@/components/messageList";
import { useGetMember } from "@/features/members/api/useGetMember";
import { useGetMessages } from "@/features/messages/api/useGetMessages";

import { Header } from "./Header";
import { ChatInput } from "./ChatInput";
import { Id } from "../../../../../../../convex/_generated/dataModel";

interface ConversationProps {
  id: Id<"conversations">;
}

export const Conversation = ({ id }: ConversationProps) => {
  const memberId = useMemberId();
  const { onOpenProfile } = usePanel();

  const { data: member, isLoading: memberLoading } = useGetMember({
    id: memberId,
  });
    
  const { results, status, loadMore } = useGetMessages({
    conversationId: id,
  });

  if (memberLoading || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        memberName={member?.user.name}
        memberImage={member?.user.image}
        onClick={() => onOpenProfile(memberId)}
      />
      <MessageList
        data={results}
        variant="conversation"
        memberImage={member?.user.image}
        memberName={member?.user.name}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <ChatInput
        placeholder={`Message ${member?.user.name}`}
        conversationId={id}
      />
    </div>
  );
};
