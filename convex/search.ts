import { query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const searchWorkspace = query({
  args: {
    workspaceId: v.id("workspace"),
    query: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const userId = await getAuthUserId(ctx);
      if (!userId) {
        throw new Error("Unauthorized");
      }

      const searchTerm = args.query.toLowerCase().trim();
      if (searchTerm.length < 2) {
        return { messages: [], members: [], channels: [] };
      }

      // Search messages - simplified and more robust
      const messages = await ctx.db
        .query("messages")
        .withIndex("by_workspace_id", (q) =>
          q.eq("workspaceId", args.workspaceId)
        )
        .collect();

      const filteredMessages = await Promise.all(
        messages
          .filter((message) => {
            try {
              const body = JSON.parse(message.body);
              if (!body || !body.ops || !Array.isArray(body.ops)) {
                return false;
              }
              return body.ops.some(
                (op: any) =>
                  op &&
                  op.insert &&
                  typeof op.insert === "string" &&
                  op.insert.toLowerCase().includes(searchTerm)
              );
            } catch {
              return false;
            }
          })
          .slice(0, 10)
          .map(async (message) => {
            try {
              const member = await ctx.db.get(message.memberId);
              if (!member) return null;

              const user = await ctx.db.get(member.userId);
              if (!user) return null;

              return {
                _id: message._id,
                _creationTime: message._creationTime,
                body: message.body,
                memberName: user.name || "Unknown User",
                memberImage: user.image,
              };
            } catch {
              return null;
            }
          })
      );

      // Search members - simplified
      const members = await ctx.db
        .query("members")
        .withIndex("by_workspace_id", (q) =>
          q.eq("workspaceId", args.workspaceId)
        )
        .collect();

      const filteredMembers = await Promise.all(
        members.slice(0, 10).map(async (member) => {
          try {
            const user = await ctx.db.get(member.userId);
            if (!user) return null;

            return {
              _id: member._id,
              userName: user.name || "Unknown User",
              userImage: user.image,
              userEmail: user.email || "",
            };
          } catch {
            return null;
          }
        })
      );

      // Search channels - simplified
      const channels = await ctx.db
        .query("channels")
        .withIndex("by_workspace_id", (q) =>
          q.eq("workspaceId", args.workspaceId)
        )
        .collect();

      const filteredChannels = channels
        .filter((channel) => channel.name.toLowerCase().includes(searchTerm))
        .slice(0, 10)
        .map((channel) => ({
          _id: channel._id,
          name: channel.name,
        }));

      // Filter out null results and return
      return {
        messages: filteredMessages.filter(Boolean),
        members: filteredMembers.filter(Boolean),
        channels: filteredChannels,
      };
    } catch (error) {
      console.error("Search error:", error);
      return { messages: [], members: [], channels: [] };
    }
  },
});
