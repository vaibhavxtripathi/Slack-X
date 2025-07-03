import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/features/auth/api/useCurrentUser";
import { Loader2, LogOut } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";

export const UserButton = () => {
  const { user, isLoading } = useCurrentUser();
  const { signOut } = useAuthActions();

  if (isLoading) {
    return <Loader2 className="size-4" />;
  }

  if (!user) {
    return null;
  }
  const { image, name, email } = user;
  const avatarFallback = name!.charAt(0).toUpperCase() || "?";

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="putline-none relative ">
        <Avatar className="rounded-md size-10 hover:opacity-75 transition">
          <AvatarImage alt={name!} src={image!} />
          <AvatarFallback className="rounded-md bg-sky-500 text-white">
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
          <LogOut className="size-4 align-middle items-center text-rose-700" />
          <span className="font-semibold text-rose-700">Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
