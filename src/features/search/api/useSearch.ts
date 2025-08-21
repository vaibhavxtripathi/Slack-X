import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const useSearch = (workspaceId: Id<"workspace">, query: string) => {
  // Always call useQuery, but pass undefined args when conditions aren't met
  const result = useQuery(
    api.search.searchWorkspace,
    !workspaceId || query.length < 2 ? "skip" : { workspaceId, query }
  );

  // Return undefined when conditions aren't met
  if (!workspaceId || query.length < 2) {
    return undefined;
  }

  return result;
};
