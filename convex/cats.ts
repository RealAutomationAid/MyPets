import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Get all cats
export const getAllCats = query({
  handler: async (ctx) => {
    return await ctx.db.query("cats").collect();
  },
});

// Get displayed cats only
export const getDisplayedCats = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("cats")
      .withIndex("by_displayed", (q) => q.eq("isDisplayed", true))
      .collect();
  },
});

// Get cat by ID
export const getCatById = query({
  args: { id: v.id("cats") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Search cats by various criteria
export const searchCats = query({
  args: {
    searchTerm: v.optional(v.string()),
    gender: v.optional(v.union(v.literal("male"), v.literal("female"))),
    isDisplayed: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let cats = await ctx.db.query("cats").collect();

    if (args.gender) {
      cats = cats.filter(cat => cat.gender === args.gender);
    }

    if (args.isDisplayed !== undefined) {
      cats = cats.filter(cat => cat.isDisplayed === args.isDisplayed);
    }

    if (args.searchTerm) {
      const term = args.searchTerm.toLowerCase();
      cats = cats.filter(cat => 
        cat.name.toLowerCase().includes(term) ||
        cat.subtitle.toLowerCase().includes(term) ||
        cat.color.toLowerCase().includes(term) ||
        cat.registrationNumber?.toLowerCase().includes(term) ||
        cat.description.toLowerCase().includes(term)
      );
    }

    return cats;
  },
});

// Create a new cat
export const createCat = mutation({
  args: {
    name: v.string(),
    subtitle: v.string(),
    image: v.string(),
    description: v.string(),
    age: v.string(),
    color: v.string(),
    status: v.string(),
    gallery: v.array(v.string()),
    gender: v.union(v.literal("male"), v.literal("female")),
    birthDate: v.string(),
    registrationNumber: v.optional(v.string()),
    isDisplayed: v.optional(v.boolean()),
    freeText: v.optional(v.string()),
    // Internal notes field (not displayed publicly)
    internalNotes: v.optional(v.string()),
    // New fields for gallery filtering
    category: v.optional(v.union(v.literal("kitten"), v.literal("adult"), v.literal("all"))),
  },
  handler: async (ctx, args) => {
    const catId = await ctx.db.insert("cats", {
      ...args,
      isDisplayed: args.isDisplayed ?? true,
    });
    return catId;
  },
});

// Update an existing cat
export const updateCat = mutation({
  args: {
    id: v.id("cats"),
    name: v.optional(v.string()),
    subtitle: v.optional(v.string()),
    image: v.optional(v.string()),
    description: v.optional(v.string()),
    age: v.optional(v.string()),
    color: v.optional(v.string()),
    status: v.optional(v.string()),
    gallery: v.optional(v.array(v.string())),
    gender: v.optional(v.union(v.literal("male"), v.literal("female"))),
    birthDate: v.optional(v.string()),
    registrationNumber: v.optional(v.string()),
    isDisplayed: v.optional(v.boolean()),
    freeText: v.optional(v.string()),
    // Internal notes field (not displayed publicly)
    internalNotes: v.optional(v.string()),
    // New fields for gallery filtering
    category: v.optional(v.union(v.literal("kitten"), v.literal("adult"), v.literal("all"))),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // Remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    await ctx.db.patch(id, cleanUpdates);
    return await ctx.db.get(id);
  },
});

// Delete a cat
export const deleteCat = mutation({
  args: { id: v.id("cats") },
  handler: async (ctx, args) => {
    // First, remove all pedigree connections involving this cat
    const parentConnections = await ctx.db
      .query("pedigreeConnections")
      .withIndex("by_parent", (q) => q.eq("parentId", args.id))
      .collect();
    
    const childConnections = await ctx.db
      .query("pedigreeConnections")
      .withIndex("by_child", (q) => q.eq("childId", args.id))
      .collect();

    // Delete all connections
    for (const connection of [...parentConnections, ...childConnections]) {
      await ctx.db.delete(connection._id);
    }

    // Delete any pedigree trees rooted at this cat
    const pedigreeTrees = await ctx.db
      .query("pedigreeTrees")
      .withIndex("by_root_cat", (q) => q.eq("rootCatId", args.id))
      .collect();

    for (const tree of pedigreeTrees) {
      await ctx.db.delete(tree._id);
    }

    // Finally, delete the cat
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// Toggle cat display status
export const toggleCatDisplay = mutation({
  args: { id: v.id("cats") },
  handler: async (ctx, args) => {
    const cat = await ctx.db.get(args.id);
    if (!cat) {
      throw new Error("Cat not found");
    }

    await ctx.db.patch(args.id, { isDisplayed: !cat.isDisplayed });
    return await ctx.db.get(args.id);
  },
});

// Bulk update display status
export const bulkUpdateDisplay = mutation({
  args: {
    catIds: v.array(v.id("cats")),
    isDisplayed: v.boolean(),
  },
  handler: async (ctx, args) => {
    const results = [];
    
    for (const catId of args.catIds) {
      await ctx.db.patch(catId, { isDisplayed: args.isDisplayed });
      const updatedCat = await ctx.db.get(catId);
      results.push(updatedCat);
    }
    
    return results;
  },
});

// Get cats by gender for breeding purposes
export const getCatsByGender = query({
  args: { gender: v.union(v.literal("male"), v.literal("female")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("cats")
      .withIndex("by_gender", (q) => q.eq("gender", args.gender))
      .collect();
  },
});

// Get recent cats (last 10 added)
export const getRecentCats = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    return await ctx.db
      .query("cats")
      .order("desc")
      .take(limit);
  },
});

// Get cat statistics
export const getCatStatistics = query({
  handler: async (ctx) => {
    const allCats = await ctx.db.query("cats").collect();
    const displayedCats = allCats.filter(cat => cat.isDisplayed);
    const males = allCats.filter(cat => cat.gender === "male");
    const females = allCats.filter(cat => cat.gender === "female");

    return {
      total: allCats.length,
      displayed: displayedCats.length,
      hidden: allCats.length - displayedCats.length,
      males: males.length,
      females: females.length,
      averageAge: allCats.length > 0 ? 
        allCats.reduce((sum, cat) => {
          const age = parseFloat(cat.age) || 0;
          return sum + age;
        }, 0) / allCats.length : 0
    };
  },
});

// Get cats by category for gallery filtering
export const getCatsByCategory = query({
  args: { category: v.union(v.literal("kitten"), v.literal("adult"), v.literal("all")) },
  handler: async (ctx, args) => {
    if (args.category === "all") {
      return await ctx.db.query("cats").collect();
    }
    
    return await ctx.db
      .query("cats")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

// Get displayed cats by category for gallery filtering (age-based)
export const getDisplayedCatsByCategory = query({
  args: { category: v.union(v.literal("kitten"), v.literal("adult"), v.literal("all")) },
  handler: async (ctx, args) => {
    const allDisplayedCats = await ctx.db
      .query("cats")
      .withIndex("by_displayed", (q) => q.eq("isDisplayed", true))
      .collect();
    
    if (args.category === "all") {
      return allDisplayedCats;
    }
    
    // Calculate age-based category for each cat
    const currentDate = new Date();
    
    return allDisplayedCats.filter(cat => {
      if (!cat.birthDate) {
        // If no birth date, fallback to manual category if available
        return cat.category === args.category;
      }
      
      const birthDate = new Date(cat.birthDate);
      const ageInYears = (currentDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      
      if (args.category === "kitten") {
        return ageInYears < 1;
      } else if (args.category === "adult") {
        return ageInYears >= 1;
      }
      
      return false;
    });
  },
});

// Get displayed cats by gender and age for the new three-section layout
export const getDisplayedCatsByGenderAndAge = query({
  args: {
    section: v.union(v.literal("male"), v.literal("female"), v.literal("kitten"))
  },
  handler: async (ctx, args) => {
    const allDisplayedCats = await ctx.db
      .query("cats")
      .withIndex("by_displayed", (q) => q.eq("isDisplayed", true))
      .collect();
    
    const currentDate = new Date();
    
    return allDisplayedCats.filter(cat => {
      // Calculate age first
      let ageInYears = 0;
      if (cat.birthDate) {
        const birthDate = new Date(cat.birthDate);
        ageInYears = (currentDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      }
      
      switch (args.section) {
        case "kitten":
          // Kittens: all cats below 1 year (both genders)
          return ageInYears < 1 || (!cat.birthDate && cat.category === "kitten");
        case "male":
          // Males: male cats 1 year and older
          return cat.gender === "male" && (ageInYears >= 1 || (!cat.birthDate && cat.category !== "kitten"));
        case "female":
          // Females: female cats 1 year and older
          return cat.gender === "female" && (ageInYears >= 1 || (!cat.birthDate && cat.category !== "kitten"));
        default:
          return false;
      }
    });
  },
});

// Bulk update category for existing cats
export const bulkUpdateCategory = mutation({
  args: {
    catIds: v.array(v.id("cats")),
    category: v.optional(v.union(v.literal("kitten"), v.literal("adult"), v.literal("all"))),
  },
  handler: async (ctx, args) => {
    const results = [];
    
    for (const catId of args.catIds) {
      await ctx.db.patch(catId, { category: args.category });
      const updatedCat = await ctx.db.get(catId);
      results.push(updatedCat);
    }
    
    return results;
  },
}); 