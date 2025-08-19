import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/features/auth/api/useCurrentUser";
import { Loader, LogOut } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";

export const UserButton = () => {
  const { user, isLoading } = useCurrentUser();
  const { signOut } = useAuthActions();

  if (isLoading) {
    return <Loader className="size-4" />;
  }

  if (!user) {
    return null;
  }
  const { image, name, email } = user;
  const avatarFallback = name!.charAt(0).toUpperCase() || "?";

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="putline-none relative ">
          <span className="text-[#20a271] text-xl absolute -bottom-1 -right-1">●</span>
        <Avatar className="rounded-md size-10 hover:opacity-75 transition">
          <span className="text-[#20a271] text-xl absolute -bottom-1 -right-1">●</span>
          <AvatarImage alt={name!} src={image!} />
          <AvatarFallback className="rounded-md bg-sky-600 text-white">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-25 ml-1.5" align="center" side="right">
        <DropdownMenuItem
          onClick={() => {
            signOut();
          }}
        >
          <LogOut className="size-4 align-middle items-center text-destructive" />
          <span className="font-semibold text-destructive">Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
