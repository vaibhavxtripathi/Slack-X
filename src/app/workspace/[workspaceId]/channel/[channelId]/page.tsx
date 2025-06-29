"use client";

import { useChannelId } from "@/hooks/useChannelId";
import { useGetChannelsById } from "@/features/channels/api/useGetChannelsById";
import { Header } from "./Header";
import { Loader, TriangleAlert } from "lucide-react";
import { ChatInput } from "./ChatInput";

const ChannelIdPage = () => {
  const channelId = useChannelId();
  const { data: channel, isLoading: channelLoading } = useGetChannelsById({
    channelId,
  });

  if (channelLoading) {
    return (
      <div className="flex h-full flex-1 w-full items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="flex h-full flex-1 w-full items-center justify-center flex-col gap-y-2">
        <TriangleAlert className="size-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Channel not found</span>
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col">
      <Header title={channel.name} />
      <div className="flex-1" />
      <ChatInput />
    </div>
  );
};

export default ChannelIdPage;
