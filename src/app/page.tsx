"use client";

import { UserButton } from "@/features/auth/components/UserButton";
import { useGetWorkspaces } from "@/features/workspaces/api/useGetWorkspaces";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/useCreateWorkspaceModal";
import { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isOpen, setIsOpen] = useCreateWorkspaceModal();
  const { data, isLoading } = useGetWorkspaces();
  const router = useRouter();
  const workspaceId = useMemo(() => data?.[0]?._id, [data]);

  useEffect(() => {
    if (isLoading) return;
    if (workspaceId) {
      router.replace(`/workspace/${workspaceId}`);
    } else if (!isOpen) {
      setIsOpen(true);
      console.log("Open workspace modal");
    }
  }, [workspaceId, isLoading, isOpen, setIsOpen, router]);

  return <>{workspaceId ? <UserButton /> : null}</>;
}
