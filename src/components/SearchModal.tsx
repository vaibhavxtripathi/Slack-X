"use client";

import { useState, useEffect } from "react";
import { Search, MessageSquare, Hash, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSearch } from "@/features/search/api/useSearch";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const workspaceId = useWorkspaceId();
  const searchResults = useSearch(workspaceId, debouncedQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search messages, files, and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 h-12 text-lg"
              autoFocus
            />
          </div>

          {debouncedQuery.length > 0 && searchResults && (
            <div className="space-y-4 max-h-96 overflow-y-auto ">
              {searchResults.messages && searchResults.messages.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Messages ({searchResults.messages.length})
                  </h3>
                  <div className="space-y-2">
                    {searchResults.messages.map((message) => (
                      <div
                        key={message._id}
                        className="p-3 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="size-8 rounded-md">
                            <AvatarImage
                              src={message.memberImage}
                              className="rounded-md"
                            />
                            <AvatarFallback className="bg-sky-600 text-white rounded-md">
                              {message.memberName?.charAt(0) || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">
                                {message.memberName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(
                                  new Date(message._creationTime),
                                  { addSuffix: true }
                                )}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {JSON.parse(message.body)?.ops?.[0]?.insert ||
                                "Message content"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.channels && searchResults.channels.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Channels ({searchResults.channels.length})
                  </h3>
                  <div className="space-y-2">
                    {searchResults.channels.map((channel) => (
                      <div
                        key={channel._id}
                        className="p-3 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-md bg-green-600 flex items-center justify-center text-white text-sm font-semibold">
                            #
                          </div>
                          <div>
                            <span className="font-medium text-sm">
                              {channel.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.members && searchResults.members.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Members ({searchResults.members.length})
                  </h3>
                  <div className="space-y-2">
                    {searchResults.members.map((member) => (
                      <div
                        key={member._id}
                        className="p-3 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8 rounded-md">
                            <AvatarImage
                              src={member.userImage}
                              className="rounded-md"
                            />
                            <AvatarFallback className="bg-purple-600 text-white rounded-md">
                              {member.userName?.charAt(0) || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">
                              {member.userName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {member.userEmail}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchResults &&
                (!searchResults.messages ||
                  searchResults.messages.length === 0) &&
                (!searchResults.channels ||
                  searchResults.channels.length === 0) &&
                (!searchResults.members ||
                  searchResults.members.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No results found for &quot;{debouncedQuery}&quot;</p>
                  </div>
                )}
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};
