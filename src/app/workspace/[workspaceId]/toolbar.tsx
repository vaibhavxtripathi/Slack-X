import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useGetWorkspace } from "@/features/workspaces/api/useGetWorkspace";
import { Info, Search } from "lucide-react";
import { Hint } from "@/components/hint";
import Link from "next/link";

const Toolbar = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspace({ id: workspaceId });

  return (
    <nav className="bg-[#481349] flex items-center justify-between h-10 p-2 ">
      <div className="flex-1" />
      <div className="min-w-[280px] max-[642px] grow-[2] shrink ">
        <Button
          size="sm"
          className="bg-accent/25 hover:bg-accent-25 w-full justify-start h-7 px-2"
        >
          <Search className="size-4 text-white mr-2" />
          <span className="text-white text-xs capitalize">
            Search {data?.name} workspace
          </span>
        </Button>
      </div>
      <div className="ml-auto flex-1 flex items-center justify-end">
        <Hint label="vxtr" side="bottom" align="center">
          <Button variant="transparent" size="Iconsm">
            <Link href={`https://www.github.com/vaibhavxtripathi`} target="_blank">
              <Info className="size-5 text-white" />
            </Link>
          </Button>
        </Hint>
      </div>
    </nav>
  );
};

export default Toolbar;
