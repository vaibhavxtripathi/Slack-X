import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

export const getChannels = query({
  args: {
    workspaceId: v.id("workspace"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return [];
    }
    const member = await ctx.db
      .query("members")
      .withIndex("by_user_id_workspace_id", (q) =>
        q.eq("userId", userId).eq("workspaceId", args.workspaceId)
      )
      .unique();
    if (!member) {
      return [];
    }
    const channels = await ctx.db
      .query("channels")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .collect();
    return channels;
  },
});

export const createChannel = mutation({
  args: {
    name: v.string(),
    workspaceId: v.id("workspace"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_user_id_workspace_id", (q) =>
        q.eq("userId", userId).eq("workspaceId", args.workspaceId)
      )
      .unique();

    if (!member) {
      throw new Error("Unauthorized");
    }

    const channelId = await ctx.db.insert("channels", {
      name: args.name,
      workspaceId: args.workspaceId,
    });

    return channelId;
  },
});
