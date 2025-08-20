"use client";

import { useGetWorkspaces } from "@/features/workspaces/api/useGetWorkspaces";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/useCreateWorkspaceModal";
import { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

export default function Home() {
  const [isOpen, setIsOpen] = useCreateWorkspaceModal();
  const { data, isLoading } = useGetWorkspaces();
  const router = useRouter();
  const workspaceId = useMemo(() => data?.[0]?._id, [data]);

  useEffect(() => {
    if (isLoading) return;
    if (workspaceId) {
      if (isOpen) {
        setIsOpen(false);
      }
      router.replace(`/workspace/${workspaceId}`);
    } else if (!isOpen && !isLoading && !workspaceId) {
      setIsOpen(true);
    }
  }, [workspaceId, isLoading, isOpen, setIsOpen, router]);

  return (
    <>
      <div className="flex flex-col items-center justify-center h-full">
        <Loader className="size-10 animate-spin" />
        <p className="text-sm text-muted-foreground">Loading workspaces...</p>
      </div>
    </>
  );
}
