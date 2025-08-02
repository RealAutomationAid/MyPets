import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all site settings
export const getAllSettings = query({
  handler: async (ctx) => {
    return await ctx.db.query("siteSettings").collect();
  },
});

// Get settings by type
export const getSettingsByType = query({
  args: { type: v.union(v.literal("social_media"), v.literal("contact_info"), v.literal("site_content"), v.literal("feature_toggle"), v.literal("analytics"), v.literal("seo")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("siteSettings")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .collect();
  },
});

// Get setting by key
export const getSettingByKey = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
  },
});

// Get social media settings (helper function)
export const getSocialMediaSettings = query({
  handler: async (ctx) => {
    const settings = await ctx.db
      .query("siteSettings")
      .withIndex("by_type", (q) => q.eq("type", "social_media"))
      .collect();
    
    // Convert to key-value object
    const socialMedia: Record<string, unknown> = {};
    settings.forEach(setting => {
      try {
        socialMedia[setting.key] = JSON.parse(setting.value);
      } catch {
        socialMedia[setting.key] = setting.value;
      }
    });

    return socialMedia;
  },
});

// Create or update setting
export const upsertSetting = mutation({
  args: {
    key: v.string(),
    value: v.string(),
    type: v.union(v.literal("social_media"), v.literal("contact_info"), v.literal("site_content"), v.literal("feature_toggle"), v.literal("analytics"), v.literal("seo")),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        value: args.value,
        type: args.type,
        description: args.description,
      });
      return await ctx.db.get(existing._id);
    } else {
      const settingId = await ctx.db.insert("siteSettings", args);
      return await ctx.db.get(settingId);
    }
  },
});

// Update social media settings (batch update)
export const updateSocialMediaSettings = mutation({
  args: {
    facebook: v.optional(v.string()),
    instagram: v.optional(v.string()),
    tiktok: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates = [];

    if (args.facebook !== undefined) {
      const result = await ctx.db
        .query("siteSettings")
        .withIndex("by_key", (q) => q.eq("key", "facebook_url"))
        .first();

      if (result) {
        await ctx.db.patch(result._id, { value: args.facebook });
      } else {
        await ctx.db.insert("siteSettings", {
          key: "facebook_url",
          value: args.facebook,
          type: "social_media",
          description: "Facebook page URL",
        });
      }
      updates.push("facebook");
    }

    if (args.instagram !== undefined) {
      const result = await ctx.db
        .query("siteSettings")
        .withIndex("by_key", (q) => q.eq("key", "instagram_url"))
        .first();

      if (result) {
        await ctx.db.patch(result._id, { value: args.instagram });
      } else {
        await ctx.db.insert("siteSettings", {
          key: "instagram_url",
          value: args.instagram,
          type: "social_media",
          description: "Instagram profile URL",
        });
      }
      updates.push("instagram");
    }

    if (args.tiktok !== undefined) {
      const result = await ctx.db
        .query("siteSettings")
        .withIndex("by_key", (q) => q.eq("key", "tiktok_url"))
        .first();

      if (result) {
        await ctx.db.patch(result._id, { value: args.tiktok });
      } else {
        await ctx.db.insert("siteSettings", {
          key: "tiktok_url",
          value: args.tiktok,
          type: "social_media",
          description: "TikTok profile URL",
        });
      }
      updates.push("tiktok");
    }

    return { updated: updates };
  },
});

// Delete setting
export const deleteSetting = mutation({
  args: { id: v.id("siteSettings") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// Initialize default settings (useful for first-time setup)
export const initializeDefaultSettings = mutation({
  handler: async (ctx) => {
    const defaults = [
      {
        key: "facebook_url",
        value: "https://www.facebook.com/profile.php?id=61561853557367",
        type: "social_media" as const,
        description: "Facebook page URL",
      },
      {
        key: "instagram_url", 
        value: "https://instagram.com/radanovpride",
        type: "social_media" as const,
        description: "Instagram profile URL",
      },
      {
        key: "tiktok_url",
        value: "https://www.tiktok.com/@radanovpridemainecoon",
        type: "social_media" as const,
        description: "TikTok profile URL",
      },
    ];

    const results = [];
    for (const setting of defaults) {
      const existing = await ctx.db
        .query("siteSettings")
        .withIndex("by_key", (q) => q.eq("key", setting.key))
        .first();

      if (!existing) {
        const id = await ctx.db.insert("siteSettings", setting);
        results.push(await ctx.db.get(id));
      }
    }

    return results;
  },
});