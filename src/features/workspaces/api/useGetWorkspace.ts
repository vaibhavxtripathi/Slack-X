import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetWorkspaceProps {
  id: Id<"workspace">;
 }

  export const useGetWorkspace = ({ id }: UseGetWorkspaceProps) => {
  const data = useQuery(api.workspaces.getWorkspaceById, { id });
    const isLoading = data === undefined;
    
  return { data, isLoading };
};
