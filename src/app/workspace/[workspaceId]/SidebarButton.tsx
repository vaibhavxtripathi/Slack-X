import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";

interface SidebarButtonProps {
  icon: LucideIcon | IconType;
  label: string;
  isActive?: boolean;
}

export const SidebarButton = ({
  icon: Icon,
  label,
  isActive,
}: SidebarButtonProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-0.5 cursor-pointer group">
      <Button
        variant="transparent"
        className={cn(
          "size-9 group-hover:bg-accent/20",
          isActive && "bg-sidebar-accent-foreground/20 p-2 rounded-md"
        )}
      >
        <Icon
          className={cn(
            "size-5 text-sidebar-foreground group-hover:scale-110 transition-all"
          )}
        />
      </Button>
      <span className="text-[11px] font-bold text-sidebar-foreground group-hover:text-accent">
        {label}
      </span>
    </div>
  );
};
