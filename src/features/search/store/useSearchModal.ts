import { atom, useAtom } from "jotai";

const searchModalAtom = atom(false);

export const useSearchModal = () => {
  return useAtom(searchModalAtom);
};
