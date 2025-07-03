"use client";

import { Loader, TriangleAlert } from "lucide-react";

import { Header } from "./Header";
import { ChatInput } from "./ChatInput";

import { useChannelId } from "@/hooks/useChannelId";

import { useGetChannels } from "@/features/channels/api/useGetChannels";
import { useGetMessages } from "@/features/messages/api/useGetMessages";
import { MessageList } from "@/components/messageList";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";

const ChannelIdPage = () => {
  const channelId = useChannelId();

  const { results, status, loadMore } = useGetMessages({ channelId });
  const workspaceId = useWorkspaceId();
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });
  if (channelsLoading || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex flex-1 items-center justify-center">
        <Loader className="animate-spin size-5 text-muted-foreground" />
      </div>
    );
  }

  if (!channels) {
    return (
      <div className="h-full flex flex-1 flex-col gap-y-2 items-center justify-center">
        <TriangleAlert className="size-5 text-destructive" />
        <span className="text-sm text-muted-foreground">Channel not found</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header title={channels[0].name} />
      <MessageList
        channelName={channels[0].name}
        channelCreationTime={channels[0]._creationTime}
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <ChatInput placeholder={`Message # ${channels[0].name}`} />
    </div>
  );
};

export default ChannelIdPage;
