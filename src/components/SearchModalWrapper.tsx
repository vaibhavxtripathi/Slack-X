"use client";

import { useSearchModal } from "@/features/search/store/useSearchModal";
import { SearchModal } from "./SearchModal";

export function SearchModalWrapper() {
  const [isSearchOpen, setIsSearchOpen] = useSearchModal();

  return (
    <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
  );
}
