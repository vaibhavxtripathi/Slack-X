import { query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const searchWorkspace = query({
  args: {
    workspaceId: v.id("workspace"),
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const searchTerm = args.query.toLowerCase().trim();
    if (searchTerm.length < 2) {
      return { messages: [], members: [], channels: [] };
    }

    // Search messages
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
            return body.ops?.some(
              (op: any) =>
                op.insert &&
                typeof op.insert === "string" &&
                op.insert.toLowerCase().includes(searchTerm)
            );
          } catch {
            return false;
          }
        })
        .slice(0, 10) // Limit to 10 results
        .map(async (message) => {
          const member = await ctx.db.get(message.memberId);
          const user = member ? await ctx.db.get(member.userId) : null;
          return {
            ...message,
            memberName: user?.name || "Unknown User",
            memberImage: user?.image,
          };
        })
    );

    // Search members
    const members = await ctx.db
      .query("members")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .collect();

    const filteredMembers = await Promise.all(
      members.slice(0, 10).map(async (member) => {
        const user = await ctx.db.get(member.userId);
        return {
          ...member,
          userName: user?.name || "Unknown User",
          userImage: user?.image,
          userEmail: user?.email,
        };
      })
    ).then((members) =>
      members.filter(
        (member) =>
          member.userName.toLowerCase().includes(searchTerm) ||
          member.userEmail?.toLowerCase().includes(searchTerm)
      )
    );

    // Search channels
    const channels = await ctx.db
      .query("channels")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .collect();

    const filteredChannels = channels
      .filter((channel) => channel.name.toLowerCase().includes(searchTerm))
      .slice(0, 10);

    return {
      messages: filteredMessages,
      members: filteredMembers,
      channels: filteredChannels,
    };
  },
});
