import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetChannelsProps {
  channelId: Id<"channels">;
}

export const useGetChannelsById = ({ channelId }: UseGetChannelsProps) => {
  const data = useQuery(api.channels.getChannelById, { channelId });
  const isLoading = data === undefined;

  return {
    data,
    isLoading,
  };
};
