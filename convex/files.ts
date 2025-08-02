import { v } from "convex/values";
import { mutation, action, query, internalMutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";

// Generate upload URL for client-side file uploads
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Store a file from an action (for server-side uploads)
export const storeFile = action({
  args: {
    file: v.any(), // File blob/buffer
    filename: v.string(),
    contentType: v.optional(v.string()),
    associatedCatId: v.optional(v.id("cats")),
    imageType: v.union(v.literal("profile"), v.literal("gallery"), v.literal("general"), v.literal("news"))
  },
  handler: async (ctx, args): Promise<{ storageId: Id<"_storage">; imageId: Id<"images"> }> => {
    // Store the file in Convex storage
    const storageId = await ctx.storage.store(args.file);
    
    // Save metadata in the images table
    const imageId: Id<"images"> = await ctx.runMutation(internal.files.saveImageMetadata, {
      storageId,
      filename: args.filename,
      associatedCatId: args.associatedCatId,
      imageType: args.imageType,
    });

    return { storageId, imageId };
  },
});

// Internal mutation to save image metadata
export const saveImageMetadata = internalMutation({
  args: {
    storageId: v.id("_storage"),
    filename: v.string(),
    associatedCatId: v.optional(v.id("cats")),
    imageType: v.union(v.literal("profile"), v.literal("gallery"), v.literal("general"), v.literal("news"))
  },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);
    
    if (!url) {
      throw new Error("Failed to get storage URL");
    }

    const imageId = await ctx.db.insert("images", {
      filename: args.filename,
      url: url,
      uploadedAt: new Date().toISOString(),
      associatedCatId: args.associatedCatId,
      imageType: args.imageType,
    });

    return imageId;
  },
});

// Get file URL from storage ID
export const getFileUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// Save file metadata after client upload
export const saveUploadedFile = mutation({
  args: {
    storageId: v.id("_storage"),
    filename: v.string(),
    associatedCatId: v.optional(v.id("cats")),
    imageType: v.union(v.literal("profile"), v.literal("gallery"), v.literal("general"), v.literal("news"))
  },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);
    
    if (!url) {
      throw new Error("Failed to get storage URL");
    }

    const imageId = await ctx.db.insert("images", {
      filename: args.filename,
      url: url,
      uploadedAt: new Date().toISOString(),
      associatedCatId: args.associatedCatId,
      imageType: args.imageType,
    });

    return { imageId, url };
  },
});

// Get all images for a cat
export const getCatImages = query({
  args: { catId: v.id("cats") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("images")
      .withIndex("by_cat", (q) => q.eq("associatedCatId", args.catId))
      .collect();
  },
});

// Delete file and its metadata
export const deleteFile = mutation({
  args: { 
    storageId: v.id("_storage"),
    imageId: v.optional(v.id("images"))
  },
  handler: async (ctx, args) => {
    // Delete from storage
    await ctx.storage.delete(args.storageId);
    
    // Delete metadata if provided
    if (args.imageId) {
      await ctx.db.delete(args.imageId);
    }
  },
});

// Get images by type
export const getImagesByType = query({
  args: { 
    imageType: v.union(v.literal("profile"), v.literal("gallery"), v.literal("general"), v.literal("news"))
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("images")
      .withIndex("by_type", (q) => q.eq("imageType", args.imageType))
      .collect();
  },
});

 