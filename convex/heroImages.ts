import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all hero images
export const getHeroImages = query({
  args: {},
  handler: async (ctx) => {
    const heroImages = await ctx.db
      .query("heroImages")
      .withIndex("by_position")
      .collect();
    
    return heroImages.sort((a, b) => a.position - b.position);
  },
});

// Get only active hero images for display
export const getActiveHeroImages = query({
  args: {},
  handler: async (ctx) => {
    const activeImages = await ctx.db
      .query("heroImages")
      .withIndex("by_active_position", (q) => q.eq("isActive", true))
      .collect();
    
    return activeImages.sort((a, b) => a.position - b.position);
  },
});

// Add a new hero image
export const addHeroImage = mutation({
  args: {
    src: v.string(),
    alt: v.string(),
    name: v.optional(v.string()),
    subtitle: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Get the next position
    const existingImages = await ctx.db.query("heroImages").collect();
    const nextPosition = existingImages.length > 0 
      ? Math.max(...existingImages.map(img => img.position)) + 1 
      : 1;

    const imageId = await ctx.db.insert("heroImages", {
      src: args.src,
      alt: args.alt,
      name: args.name,
      subtitle: args.subtitle,
      isActive: args.isActive ?? false,
      position: nextPosition,
      uploadedAt: Date.now(),
    });

    return imageId;
  },
});

// Update hero image
export const updateHeroImage = mutation({
  args: {
    id: v.id("heroImages"),
    src: v.optional(v.string()),
    alt: v.optional(v.string()),
    name: v.optional(v.string()),
    subtitle: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    position: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // Remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    await ctx.db.patch(id, cleanUpdates);
    return id;
  },
});

// Delete hero image
export const deleteHeroImage = mutation({
  args: {
    id: v.id("heroImages"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Reorder hero images
export const reorderHeroImages = mutation({
  args: {
    imageUpdates: v.array(v.object({
      id: v.id("heroImages"),
      position: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    // Update positions for all provided images
    for (const update of args.imageUpdates) {
      await ctx.db.patch(update.id, { position: update.position });
    }
    
    return true;
  },
});

// Toggle image active status
export const toggleHeroImageActive = mutation({
  args: {
    id: v.id("heroImages"),
  },
  handler: async (ctx, args) => {
    const image = await ctx.db.get(args.id);
    if (!image) {
      throw new Error("Image not found");
    }

    // Check if we're trying to activate an image when we already have 6 active
    if (!image.isActive) {
      const activeImages = await ctx.db
        .query("heroImages")
        .withIndex("by_active", (q) => q.eq("isActive", true))
        .collect();
      
      if (activeImages.length >= 6) {
        throw new Error("Maximum of 6 active hero images allowed");
      }
    }

    await ctx.db.patch(args.id, { isActive: !image.isActive });
    return args.id;
  },
});

// Move hero image up or down in order
export const moveHeroImage = mutation({
  args: {
    id: v.id("heroImages"),
    direction: v.union(v.literal("up"), v.literal("down")),
  },
  handler: async (ctx, args) => {
    const currentImage = await ctx.db.get(args.id);
    if (!currentImage) {
      throw new Error("Image not found");
    }

    // Get all active images sorted by position
    const activeImages = await ctx.db
      .query("heroImages")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
    
    const sortedActiveImages = activeImages.sort((a, b) => a.position - b.position);
    const currentIndex = sortedActiveImages.findIndex(img => img._id === args.id);
    
    if (currentIndex === -1) return; // Image not found in active list

    const targetIndex = args.direction === "up" ? currentIndex - 1 : currentIndex + 1;
    
    // Check bounds
    if (targetIndex < 0 || targetIndex >= sortedActiveImages.length) return;

    // Swap positions
    const targetImage = sortedActiveImages[targetIndex];
    const currentPosition = currentImage.position;
    const targetPosition = targetImage.position;

    await ctx.db.patch(currentImage._id, { position: targetPosition });
    await ctx.db.patch(targetImage._id, { position: currentPosition });

    return true;
  },
});