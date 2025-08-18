import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePanel } from "@/hooks/usePanel";
import { Id } from "../../convex/_generated/dataModel";

interface ConversationHeroProps {
  name?: string;
  image?: string;
  memberId: Id<"members">;
}

export const ConversationHero = ({
  name = "Member",
  image,
  memberId,
}: ConversationHeroProps) => {
  const avatarFallback = name.charAt(0).toUpperCase();
  const { onOpenProfile } = usePanel();
  return (
    <div className="mt-[88px] mx-5 mb-4">
      <div className="flex items-center gap-x-1 mb-2 ">
        <button onClick={() => onOpenProfile(memberId)}>
          <Avatar className="size-12 mr-2 rounded-md cursor-pointer">
            <AvatarImage src={image} />
            <AvatarFallback className="rounded-md bg-sky-600 text-white text-xl">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </button>
        <p className="text-2xl font-bold cursor-pointer">{name}</p>
      </div>
      <p className="font-normal text-slate-800 mb-4">
        This conversation is just between you and <strong>{name}</strong>
      </p>
    </div>
  );
};
