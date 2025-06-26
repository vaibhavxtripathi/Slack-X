import { Id } from "../../../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";

const userItemVariants = cva(
  "flex items-center gap-1.5 justify-start font-normal h-7 px-2 cursor-pointer text-xl, overflow-hidden",
  {
    variants: {
      variant: {
        default: "text-[#f9edffcc]",
        active: "text-[#481349] bg-white/90 hover:bg-white/90",
      },
      defaultVariants: {
        variant: "default",
      },
    },
  }
);

interface UserItemProps {
  id: Id<"members">;
  label?: string;
  image?: string;
  variant?: VariantProps<typeof userItemVariants>["variant"];
}

export const UserItem = ({ id, label, image, variant }: UserItemProps) => {
  const workspaceId = useWorkspaceId();
  return (
    <Button
      variant="transparent"
      className={cn(userItemVariants({ variant: variant }))}
    >
      <Link href={`/workspace/${workspaceId}/member/${id}`}>
        <Avatar className="size-5 rounded-md mr-1">
          <AvatarImage src={image} />
          <AvatarFallback className="rounded-md bg-sky-500 text-white">
            {label?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </Link>
      <span className="truncate text-sm">{label}</span>
    </Button>
  );
};
