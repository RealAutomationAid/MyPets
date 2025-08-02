import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Get all announcements
export const getAllAnnouncements = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("announcements")
      .withIndex("by_sort_order", (q) => q.gt("sortOrder", -1))
      .collect();
  },
});

// Get published announcements only (for public site)
export const getPublishedAnnouncements = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("announcements")
      .withIndex("by_published", (q) => q.eq("isPublished", true))
      .order("desc")
      .collect();
  },
});

// Get latest published announcements with limit
export const getLatestAnnouncements = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 3;
    return await ctx.db
      .query("announcements")
      .withIndex("by_published", (q) => q.eq("isPublished", true))
      .order("desc")
      .take(limit);
  },
});

// Get announcement by ID
export const getAnnouncementById = query({
  args: { id: v.id("announcements") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create new announcement
export const createAnnouncement = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    featuredImage: v.optional(v.string()),
    isPublished: v.boolean(),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("announcements", {
      ...args,
      publishedAt: args.isPublished ? now : 0,
      updatedAt: now,
    });
  },
});

// Update announcement
export const updateAnnouncement = mutation({
  args: {
    id: v.id("announcements"),
    title: v.string(),
    content: v.string(),
    featuredImage: v.optional(v.string()),
    isPublished: v.boolean(),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    const existing = await ctx.db.get(id);
    
    if (!existing) {
      throw new Error("Announcement not found");
    }

    const now = Date.now();
    return await ctx.db.patch(id, {
      ...updateData,
      publishedAt: updateData.isPublished ? (existing.publishedAt || now) : 0,
      updatedAt: now,
    });
  },
});

// Delete announcement
export const deleteAnnouncement = mutation({
  args: { id: v.id("announcements") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Toggle publication status
export const toggleAnnouncementPublication = mutation({
  args: { id: v.id("announcements") },
  handler: async (ctx, args) => {
    const announcement = await ctx.db.get(args.id);
    
    if (!announcement) {
      throw new Error("Announcement not found");
    }

    const now = Date.now();
    const isPublished = !announcement.isPublished;
    
    return await ctx.db.patch(args.id, {
      isPublished,
      publishedAt: isPublished ? (announcement.publishedAt || now) : 0,
      updatedAt: now,
    });
  },
});

// Update sort order for multiple announcements
export const updateSortOrder = mutation({
  args: { updates: v.array(v.object({ id: v.id("announcements"), sortOrder: v.number() })) },
  handler: async (ctx, args) => {
    const promises = args.updates.map(({ id, sortOrder }) =>
      ctx.db.patch(id, { sortOrder, updatedAt: Date.now() })
    );
    
    return await Promise.all(promises);
  },
});