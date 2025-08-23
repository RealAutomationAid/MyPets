import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

export type GalleryCategory = "award" | "certificate" | "photo" | "trophy" | "achievement";

export interface GalleryItem {
  _id: Id<"gallery">;
  title: string;
  description?: string;
  imageUrl: string;
  category: GalleryCategory;
  date?: string;
  isPublished: boolean;
  sortOrder: number;
  uploadedAt: number;
  associatedCatId?: Id<"cats">;
  tags?: string[];
}

// Hook to get all published gallery items with optional category filter
export const usePublishedGalleryItems = (category?: GalleryCategory | "all") => {
  return useQuery(
    api.gallery.getPublishedGalleryItems,
    category && category !== "all" ? { category } : {}
  );
};

// Hook to get gallery categories with counts
export const useGalleryCategoriesWithCounts = () => {
  return useQuery(api.gallery.getGalleryCategoriesWithCounts);
};

// Helper function to get category label in Bulgarian
export const getCategoryLabel = (category: GalleryCategory | "all"): string => {
  const labels = {
    all: "Всички",
    award: "Награди",
    certificate: "Сертификати", 
    photo: "Снимки",
    trophy: "Трофеи",
    achievement: "Постижения"
  };
  return labels[category] || category;
};

// Helper function to get category color classes
export const getCategoryColor = (category: GalleryCategory): string => {
  const colors = {
    award: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    certificate: 'bg-blue-100 text-blue-800 border-blue-300',
    photo: 'bg-green-100 text-green-800 border-green-300',
    trophy: 'bg-purple-100 text-purple-800 border-purple-300',
    achievement: 'bg-orange-100 text-orange-800 border-orange-300'
  };
  return colors[category] || 'bg-gray-100 text-gray-800 border-gray-300';
};

// Helper function to format date
export const formatGalleryDate = (date?: string): string => {
  if (!date) return '';
  return date;
};