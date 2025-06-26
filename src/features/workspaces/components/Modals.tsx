"use client";

import { CreateChannelModal } from "@/features/channels/components/CreateChannelModal";
import { CreateWorkspaceModal } from "./CreateWorkspaceModal";
import { useState, useEffect } from "react";

export const Modals = () => {

    //Preventing hydration error, this will ensure that the modal is not rendered on the server and only on the client where it is needed 
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;
    
  return (
    <>
      <CreateChannelModal />
      <CreateWorkspaceModal />
    </>
  );
};