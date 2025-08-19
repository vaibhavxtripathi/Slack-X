"use client";

import { Loader } from "lucide-react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { usePanel } from "@/hooks/usePanel";
import { Thread } from "@/features/messages/components/threads";
import { Profile } from "@/features/members/components/Profile";

import Sidebar from "./sidebar";
import Toolbar from "./toolbar";
import WorkspaceSidebar from "./WorkspaceSidebar";

import { Id } from "../../../../convex/_generated/dataModel";

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
}

const WorkspaceIdLayout = ({ children }: WorkspaceIdLayoutProps) => {
  const { parentMessageId, profileMemberId, onClose } = usePanel();
  const showPanel = !!parentMessageId || !!profileMemberId;

  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)] pb-1 bg-navbar">
        <Sidebar />
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="ca-workspace-layout"
        >
          <ResizablePanel minSize={11} defaultSize={20} className="bg-navbar">
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle className="w-[1px] bg-none hover:bg-[#1C9CD3] transition-all duration-150 h-[calc(100vh-50px)]" />
          <ResizablePanel
            minSize={20}
            defaultSize={80}
            className={showPanel ? "bg-navbar pb-1" : "bg-navbar pb-1 pr-1"}
          >
            <div className="h-full bg-background rounded-tr-md rounded-br-md border-[0.5px] border-r-sidebar-border border-t-sidebar-border border-b-sidebar-border">
              {children}
            </div>
          </ResizablePanel>
          {showPanel && (
            <>
              <ResizableHandle />
              <ResizablePanel
                minSize={20}
                defaultSize={24}
                maxSize={24}
                className="bg-navbar pb-1"
              >
                <div className="h-full bg-background rounded-tl-md rounded-bl-md border-[0.5px] border-r-sidebar-border border-t-sidebar-border border-b-sidebar-border">
                  {parentMessageId ? (
                    <Thread
                      messageId={parentMessageId as Id<"messages">}
                      onClose={onClose}
                    />
                  ) : profileMemberId ? (
                    <Profile
                      memberId={profileMemberId as Id<"members">}
                      onClose={onClose}
                    />
                  ) : (
                    <div className="flex h-[calc(100vh-50px)] pb-1 items-center justify-center">
                      <Loader className="size-5 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default WorkspaceIdLayout;
