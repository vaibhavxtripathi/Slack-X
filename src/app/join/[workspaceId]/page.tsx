"use client";
import VerificationInput from "react-verification-input";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/useGetWorkspaceInfo";
import { Loader } from "lucide-react";
import { useJoinWorkspace } from "@/features/workspaces/api/useJoin";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMemo, useEffect } from "react";

const JoinPage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId });
  const { mutate } = useJoinWorkspace();
  const isMember = useMemo(() => data?.isMember, [data?.isMember]);

  useEffect(() => {
    if (isMember) {
      toast.error("You are already a member of this workspace");
      router.replace(`/workspace/${workspaceId}`);
    }
  }, [isMember, router, workspaceId]);

  const handleComplete = (code: string) => {
    mutate(
      {
        workspaceId,
        joinCode: code,
      },
      {
        onSuccess: (id) => {
          router.replace(`/workspace/${id}`);
          toast.success("Workspace joined successfully");
        },
        onError: () => {
          toast.error("Failed to join workspace");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center gap-y-8 bg-white p-8 rounded-lg shadow-md">
      <Image
        src="/image.png"
        alt="logo"
        width={80}
        height={80}
        draggable={false}
      />
      <div className="flex flex-col items-center justify-center gap-y-4 max-w-md">
        <div className="flex flex-col items-center justify-center gap-y-2">
          <h1 className="text-2xl font-bold capitalize">Join {data?.name}</h1>
          <p className="text-md text-muted-foreground">
            Enter the code to join the workspace
          </p>
        </div>
        <VerificationInput
          length={6}
          placeholder=""
          autoFocus
          onComplete={handleComplete}
          classNames={{
            container: "flex gap-x-2",
            character:
              "uppercase h-auto rounded-md border border-gray-200 flex items-center justify-center text-lg font-medium text-gray-500",
            characterInactive: "!bg-muted",
            characterFilled: "bg-white text-black",
            characterSelected: "bg-white text-black",
          }}
        />
      </div>
      <div className="flex gap-x-4">
        <Button variant="outline" asChild size="lg">
          <Link href="/">
            <ArrowLeftIcon className="size-4" />
            Back to home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default JoinPage;
