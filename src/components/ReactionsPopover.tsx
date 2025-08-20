import { useState, lazy } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "@/components/ui/button";
import { MdOutlineAddReaction } from "react-icons/md";
import { EmojiStyle, EmojiClickData } from "emoji-picker-react";

const EmojiPicker = lazy(() => import("emoji-picker-react"));

interface ReactionsPopoverProps {
  onReactionClick: (emojiData: EmojiClickData) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const ReactionsPopover = ({
  onReactionClick,
  disabled,
  children,
}: ReactionsPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleReactionClick = (emojiData: EmojiClickData) => {
    onReactionClick(emojiData);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {children || (
          <Button
            variant="ghost"
            size="icon"
            disabled={disabled}
            className="h-6 w-6 p-0 rounded-full bg-slate-200/70 border border-transparent hover:border-slate-500 text-slate-800"
          >
            <MdOutlineAddReaction className="size-4" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <EmojiPicker
          onEmojiClick={handleReactionClick}
          reactionsDefaultOpen={true}
          autoFocusSearch={false}
          searchPlaceHolder="Search emoji..."
          emojiStyle={EmojiStyle.NATIVE}
          width={350}
          height={400}
        />
      </PopoverContent>
    </Popover>
  );
};
