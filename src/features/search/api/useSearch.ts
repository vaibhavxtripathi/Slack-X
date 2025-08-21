import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const useSearch = (workspaceId: Id<"workspace">, query: string) => {
  // Don't query if no workspace ID or query is too short
  if (!workspaceId || query.length < 2) {
    return undefined;
  }
  
  return useQuery(api.search.searchWorkspace, {
    workspaceId,
    query,
  });
};
