import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useGetWorkspace } from "@/features/workspaces/api/useGetWorkspace";
import { Info, Search } from "lucide-react";
import { Hint } from "@/components/hint";
import Link from "next/link";
import { SearchModal } from "@/components/SearchModal";
import { useSearchModal } from "@/features/search/store/useSearchModal";

const Toolbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useSearchModal();
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspace({ id: workspaceId });

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setIsSearchOpen]);

  return (
    <>
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <nav className="bg-navbar flex items-center justify-between h-10 p-2 ">
        <div className="flex-1" />
        <div className="min-w-[280px] max-[642px] grow-[2] shrink ">
          <Button
            size="sm"
            className="bg-sidebar-accent hover:bg-sidebar-accent/80 text-sidebar-accent-foreground w-full justify-start h-7 px-2 transition-colors"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="size-4 mr-2 text-center" />
            <span className="text-xs capitalize">
              Search {data?.name} workspace
            </span>
            <span className="text-xs text-muted-foreground ml-auto">⌘K</span>
          </Button>
        </div>
        <div className="ml-auto flex-1 flex items-center justify-end">
          <Hint label="vxtr" side="bottom" align="center">
            <Button variant="transparent" size="Iconsm">
              <Link
                href={`https://www.github.com/vaibhavxtripathi`}
                target="_blank"
              >
                <Info className="size-5 text-sidebar-foreground" />
              </Link>
            </Button>
          </Hint>
        </div>
      </nav>
    </>
  );
};

export default Toolbar;
