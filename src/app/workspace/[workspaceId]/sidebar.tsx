import { UserButton } from "@/features/auth/components/UserButton";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import { Bell, Home, MessagesSquare, MoreHorizontal } from "lucide-react";
import { SidebarButton } from "./SidebarButton";

const Sidebar = () => {
  return (
    <aside className="w-[70px] bg-navbar h-full flex flex-col gap-y-4 items-center pt-[0px] pb-4">
      <WorkspaceSwitcher />
      <SidebarButton icon={Home} label="Home" isActive={true} />
      <SidebarButton icon={MessagesSquare} label="DMs" isActive={false} />
      <SidebarButton icon={Bell} label="Activity" isActive={false} />
      <SidebarButton icon={MoreHorizontal} label="More" isActive={false} />
      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        <UserButton />
      </div>
    </aside>
  );
};

export default Sidebar;
