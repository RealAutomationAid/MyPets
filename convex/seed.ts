import { internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

// Type definitions for mutation results
interface SeedDatabaseResult {
  success: boolean;
  message: string;
  cats?: Array<{ id: string; name: string }>;
}

interface ClearDatabaseResult {
  success: boolean;
  message: string;
  deletedItems?: {
    cats: number;
    connections: number;
    trees: number;
    sessions: number;
    contacts: number;
  };
}

interface ReseedDatabaseResult {
  cats: number;
  connections: number;
  contacts: number;
  seedSuccess: boolean;
  clearSuccess: boolean;
}

export const seedDatabase = internalMutation({
  handler: async (ctx): Promise<SeedDatabaseResult> => {
    // Check if database is already seeded
    const existingCats = await ctx.db.query("cats").collect();
    if (existingCats.length > 0) {
      console.log("Database already seeded, skipping...");
      return { success: true, message: "Database already contains data" };
    }

    // Seed cats with corrected image paths using proper asset URLs
    const sampleCats = [
      {
        name: 'OLIVER',
        subtitle: 'GINGER MAGIC',
        image: '/model-cat-1.jpg',
        description: 'Величествен мъжки рагдол с изключителни родословни линии.',
        age: '2 години',
        color: 'Brown tabby с бели маркировки',
        status: 'Достъпен',
        gallery: ['/model-cat-1.jpg'],
        gender: 'male' as const,
        birthDate: '2022-01-15',
        registrationNumber: 'MC-2022-001',
        isDisplayed: true,
        category: 'adult' as const,
        freeText: 'Изключителен характер, много социален'
      },
      {
        name: 'BELLA',
        subtitle: 'SILVER GRACE',
        image: '/model-cat-2.jpg',
        description: 'Елегантна женска с прекрасни сребристи маркировки.',
        age: '3 години',
        color: 'Silver tabby',
        status: 'Достъпен',
        gallery: ['/model-cat-2.jpg'],
        gender: 'female' as const,
        birthDate: '2021-03-10',
        registrationNumber: 'MC-2021-002',
        isDisplayed: true,
        category: 'adult' as const,
        freeText: 'Перфектна майка, много грижовна'
      },
      {
        name: 'LUNA',
        subtitle: 'MIDNIGHT BEAUTY',
        image: '/model-cat-3.jpg',
        description: 'Красива женска котка с тъмни маркировки.',
        age: '6 месеца',
        color: 'Brown tabby',
        status: 'Достъпен',
        gallery: ['/model-cat-3.jpg'],
        gender: 'female' as const,
        birthDate: '2024-06-15',
        registrationNumber: 'MC-2024-003',
        isDisplayed: true,
        category: 'kitten' as const,
        freeText: 'Младо котенце, много игриво'
      },
      {
        name: 'MAXIMUS',
        subtitle: 'ROYAL THUNDER',
        image: '/featured-cat-1.jpg',
        description: 'Мощен мъжки рагдол с внушителни размери и благороден характер.',
        age: '4 години',
        color: 'Red classic tabby',
        status: 'Достъпен',
        gallery: ['/featured-cat-1.jpg'],
        gender: 'male' as const,
        birthDate: '2020-11-20',
        registrationNumber: 'MC-2020-004',
        isDisplayed: true,
        category: 'adult' as const,
        freeText: 'Отличен бащински инстинкт, спокоен темперамент'
      },
      {
        name: 'AURORA',
        subtitle: 'CRYSTAL SNOW',
        image: '/featured-cat-2.jpg',
        description: 'Изящна котка с перфектни бели маркировки и лазурни очи.',
        age: '1 година',
        color: 'Blue silver tabby с бели',
        status: 'Достъпен',
        gallery: ['/featured-cat-2.jpg'],
        gender: 'female' as const,
        birthDate: '2023-08-12',
        registrationNumber: 'MC-2023-005',
        isDisplayed: true,
        category: 'adult' as const,
        freeText: 'Изключително красива, много фотогенична'
      },
      {
        name: 'THOR',
        subtitle: 'STORM WARRIOR',
        image: '/istockphoto-1092493548-612x612.jpg',
        description: 'Внушителен мъжки с дива красота и силен характер.',
        age: '5 години',
        color: 'Brown mackerel tabby',
        status: 'Достъпен',
        gallery: ['/istockphoto-1092493548-612x612.jpg'],
        gender: 'male' as const,
        birthDate: '2019-04-08',
        registrationNumber: 'MC-2019-006',
        isDisplayed: true,
        category: 'adult' as const,
        freeText: 'Опитен бащински производител, много здрав'
      }
    ];

    const createdCats = [];
    for (const cat of sampleCats) {
      const catId = await ctx.db.insert("cats", cat);
      createdCats.push({ id: catId, name: cat.name });
    }

    // Create some sample pedigree connections
    // Find Oliver (father) and Bella (mother) to create Luna as their child
    const oliver = createdCats.find(cat => cat.name === 'OLIVER');
    const bella = createdCats.find(cat => cat.name === 'BELLA');
    const luna = createdCats.find(cat => cat.name === 'LUNA');

    if (oliver && bella && luna) {
      await ctx.db.insert("pedigreeConnections", {
        parentId: oliver.id,
        childId: luna.id,
        type: "father"
      });

      await ctx.db.insert("pedigreeConnections", {
        parentId: bella.id,
        childId: luna.id,
        type: "mother"
      });
    }

    return {
      success: true,
      message: `Database seeded successfully with ${createdCats.length} cats`,
      cats: createdCats
    };
  },
});

// Helper function to clear all data (useful for development)
export const clearDatabase = internalMutation({
  handler: async (ctx): Promise<ClearDatabaseResult> => {
    // Clear all tables
    const cats = await ctx.db.query("cats").collect();
    const connections = await ctx.db.query("pedigreeConnections").collect();
    const trees = await ctx.db.query("pedigreeTrees").collect();
    const sessions = await ctx.db.query("adminSessions").collect();
    const contacts = await ctx.db.query("contactSubmissions").collect();

    for (const cat of cats) {
      await ctx.db.delete(cat._id);
    }

    for (const connection of connections) {
      await ctx.db.delete(connection._id);
    }

    for (const tree of trees) {
      await ctx.db.delete(tree._id);
    }

    for (const session of sessions) {
      await ctx.db.delete(session._id);
    }

    for (const contact of contacts) {
      await ctx.db.delete(contact._id);
    }

    return {
      success: true,
      message: "Database cleared successfully",
      deletedItems: {
        cats: cats.length,
        connections: connections.length,
        trees: trees.length,
        sessions: sessions.length,
        contacts: contacts.length
      }
    };
  },
});

// Re-seed database (clear and seed)
export const reseedDatabase = internalMutation({
  handler: async (ctx): Promise<ReseedDatabaseResult> => {
    const clearResult: ClearDatabaseResult = await ctx.runMutation(internal.seed.clearDatabase);
    const seedResult: SeedDatabaseResult = await ctx.runMutation(internal.seed.seedDatabase);
    
    return {
      cats: seedResult.cats?.length || 0,
      connections: clearResult.deletedItems?.connections || 0,
      contacts: clearResult.deletedItems?.contacts || 0,
      seedSuccess: seedResult.success,
      clearSuccess: clearResult.success
    };
  },
}); 

// Migration to add category field to existing cats
export const migrateCategoryField = internalMutation({
  handler: async (ctx) => {
    const catsWithoutCategory = await ctx.db
      .query("cats")
      .filter((q) => q.eq(q.field("category"), undefined))
      .collect();

    console.log(`Found ${catsWithoutCategory.length} cats without category field`);

    for (const cat of catsWithoutCategory) {
      // Determine category based on age
      let category: "kitten" | "adult" = "adult";
      
      if (cat.age && (cat.age.includes("месец") || cat.age.includes("month"))) {
        // If age contains "месец" (months in Bulgarian), it's likely a kitten
        const monthMatch = cat.age.match(/(\d+)\s*месец/);
        if (monthMatch && parseInt(monthMatch[1]) < 12) {
          category = "kitten";
        }
      }

      await ctx.db.patch(cat._id, { category });
      console.log(`Updated ${cat.name} with category: ${category}`);
    }

    return {
      success: true,
      message: `Migrated ${catsWithoutCategory.length} cats with category field`,
      updatedCount: catsWithoutCategory.length
    };
  },
}); 

// Seed hero images
export const seedHeroImages = internalMutation({
  handler: async (ctx) => {
    // Check if we have enough seeded images (excluding uploaded ones)
    const seededImages = await ctx.db
      .query("heroImages")
      .filter(q => q.or(
        q.eq(q.field("src"), "/featured-cat-1.jpg"),
        q.eq(q.field("src"), "/featured-cat-2.jpg"),
        q.eq(q.field("src"), "/model-cat-1.jpg"),
        q.eq(q.field("src"), "/model-cat-2.jpg"),
        q.eq(q.field("src"), "/model-cat-3.jpg")
      ))
      .collect();
    
    if (seededImages.length >= 5) {
      console.log("Hero images already seeded, skipping...");
      return { success: true, message: "Hero images already exist" };
    }

    const heroImagesData = [
      { src: "/featured-cat-1.jpg", alt: "OLIVIA", isActive: true, position: 1 },
      { src: "/featured-cat-2.jpg", alt: "MIA", isActive: true, position: 2 },
      { src: "/model-cat-1.jpg", alt: "BUBBLE", isActive: true, position: 3 },
      { src: "/model-cat-2.jpg", alt: "ZIGGY", isActive: true, position: 4 },
      { src: "/model-cat-3.jpg", alt: "MOMO", isActive: true, position: 5 },
    ];

    // Only insert missing images
    for (const heroImage of heroImagesData) {
      const exists = seededImages.find(img => img.src === heroImage.src);
      if (!exists) {
        await ctx.db.insert("heroImages", {
          ...heroImage,
          uploadedAt: Date.now(),
        });
      }
    }

    const newImagesCount = heroImagesData.filter(img => !seededImages.find(existing => existing.src === img.src)).length;
    console.log(`Seeded ${newImagesCount} new hero images`);
    return {
      success: true,
      message: `Seeded ${newImagesCount} new hero images successfully`,
      count: newImagesCount
    };
  },
});