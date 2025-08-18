import { useState, lazy, Suspense } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Smile, Loader } from "lucide-react";
import { EmojiStyle } from "emoji-picker-react";

const EmojiPicker = lazy(() => import("emoji-picker-react"));

interface EmojiPopoverProps {
  onEmojiClick: (emojiData: any) => void;
  disabled?: boolean;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}

export const EmojiPopover = ({
  onEmojiClick,
  disabled,
  children,
  icon,
}: EmojiPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleEmojiClick = (emojiData: any) => {
    onEmojiClick(emojiData);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {children || <div>{icon || <Smile className="size-4" />}</div>}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Suspense
          fallback={
            <div className="w-[350px] h-[400px] flex items-center justify-center">
              <Loader className="size-6 animate-spin text-muted-foreground" />
            </div>
          }
        >
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            autoFocusSearch={false}
            searchPlaceHolder="Search emoji..."
            emojiStyle={EmojiStyle.NATIVE}
            width={350}
            height={400}
          />
        </Suspense>
      </PopoverContent>
    </Popover>
  );
};
