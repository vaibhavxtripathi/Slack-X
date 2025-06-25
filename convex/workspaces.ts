import { query } from "./_generated/server";
import { auth } from "./auth";
import { mutation } from "./_generated/server";
import { v } from "convex/values";


const generateCode = () => {
    const code = Array.from(
      { length: 6 },
      () =>
        "0123456789abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 36)]
    ).join("");
    return code;
};
  

export const createWorkspace = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
      
    const joinCode = generateCode();

    const workspaceId = await ctx.db.insert("workspace", {
      name: args.name,
      userId,
      joinCode,
    });

    await ctx.db.insert("members", {
      userId,
      workspaceId,
      role: "admin",
    });

    return workspaceId;
  },
});

export const getWorkspaces = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return [];
    }

    const members = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    const workspaceIds = members.map((member) => member.workspaceId);

    const workspaces = [];

    for (const workspaceId of workspaceIds) {
      const workspace = await ctx.db.get(workspaceId);

      if (workspace) {
        workspaces.push(workspace);
      }
    }

    return workspaces;
  },
});

export const getWorkspaceById = query({
  args: { id: v.id("workspace") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_user_id_workspace_id", (q) =>
        q.eq("userId", userId).eq("workspaceId", args.id)
      )
      .unique();

    if (!member) {
      return null;
    }

    return await ctx.db.get(args.id);
  },
});

export const updateWorkspaceName = mutation({
  args: {
    id: v.id("workspace"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_user_id_workspace_id", (q) =>
        q.eq("userId", userId).eq("workspaceId", args.id)
      )
      .unique();
    
    if (!member || member.role !== "admin") {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, {
      name: args.name,
    });

    return args.id;
  },
});

export const deleteWorkspace = mutation({
  args: {
    id: v.id("workspace"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_user_id_workspace_id", (q) =>
        q.eq("userId", userId).eq("workspaceId", args.id)
      )
      .unique();
    
    if (!member || member.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const [members] = await Promise.all([
      ctx.db
        .query("members")
        .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.id))
        .collect(),
    ]);

    for (const member of members) {
      await ctx.db.delete(member._id);
    }

    await ctx.db.delete(args.id);

    return args.id;
  },
});

