import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const useGetMembers = (workspaceId: Id<"workspace">) => {
    const data = useQuery(api.members.getMembers, { workspaceId });
    const isLoading = data === undefined;

    return { data, isLoading };
}