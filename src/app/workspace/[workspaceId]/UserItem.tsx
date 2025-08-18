import { Id } from "../../../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";

const userItemVariants = cva(
  "flex items-center gap-1.5 justify-start font-normal h-7 px-2 cursor-pointer text-xl, overflow-hidden mt-1",
  {
    variants: {
      variant: {
        default: "text-[#f9edffcc]",
        active: "text-[#481349] bg-[#f9edff] hover:bg-[#f9edff]",
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
      asChild
      variant="transparent"
      className={cn(userItemVariants({ variant: variant }))}
    >
      <Link
        href={`/workspace/${workspaceId}/channel/member/${id}`}
        className="flex items-center gap-1.5"
      >
        <Avatar className="size-5 rounded-md mr-1">
          <AvatarImage src={image} />
          <AvatarFallback className="rounded-md bg-sky-600 text-white">
            {label?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="truncate text-sm">{label}</span>
      </Link>
    </Button>
  );
};
