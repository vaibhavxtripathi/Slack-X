import Quill from "quill";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";

import { useWorkspaceId } from "@/hooks/useWorkspaceId";

import { useCreateMessages } from "@/features/messages/api/useCreateMessages";
import { useGenerateUploadUrl } from "@/features/upload/api/useGenerateUploadUrl";

import { Id } from "../../../../../../../convex/_generated/dataModel";

const Editor = dynamic(
  () => import("@/app/workspace/[workspaceId]/channel/[channelId]/Editor"),
  { ssr: false }
);

interface ChatInputProps {
  placeholder?: string;
  conversationId: Id<"conversations">;
}

type CreateMessageValues = {
  conversationId: Id<"conversations">;
  workspaceId: Id<"workspace">;
  body: string;
  image?: Id<"_storage"> | undefined;
};

export const ChatInput = ({ placeholder, conversationId }: ChatInputProps) => {
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const editorRef = useRef<Quill | null>(null);

  const workspaceId = useWorkspaceId();

  const { mutate: createMessage } = useCreateMessages();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      setIsPending(true);
      editorRef?.current?.enable(false);

      const values: CreateMessageValues = {
        conversationId,
        workspaceId,
        body,
        image: undefined,
      };

      if (image) {
        const url = await generateUploadUrl({}, { throwError: true });

        if (!url) {
          throw new Error("URL not found");
        }

        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });

        if (!result.ok) {
          throw new Error("Failed to upload image");
        }

        const { storageId } = await result.json();

        values.image = storageId;
      }

      await createMessage(values, { throwOnError: true });

      setEditorKey((prevKey) => prevKey + 1);
    } catch {
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
      editorRef?.current?.enable(true);
    }
  };

  return (
    <div className="px-5 w-full">
      <Editor
        key={editorKey}
        placeholder={placeholder}
        disabled={isPending}
        onSubmit={handleSubmit}
        innerRef={editorRef}
      />
    </div>
  );
};
