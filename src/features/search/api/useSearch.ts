import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const useSearch = (workspaceId: Id<"workspace">, query: string) => {
  return useQuery(api.search.searchWorkspace, {
    workspaceId,
    query,
  });
};
