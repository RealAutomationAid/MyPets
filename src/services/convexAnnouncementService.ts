import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

// Query hooks for announcements
export const useAllAnnouncements = () => {
  return useQuery(api.announcements.getAllAnnouncements);
};

export const usePublishedAnnouncements = () => {
  return useQuery(api.announcements.getPublishedAnnouncements);
};

export const useLatestAnnouncements = (limit?: number) => {
  return useQuery(api.announcements.getLatestAnnouncements, { limit });
};

export const useAnnouncementById = (id: Id<"announcements">) => {
  return useQuery(api.announcements.getAnnouncementById, { id });
};

// Mutation hooks for announcements
export const useCreateAnnouncement = () => {
  return useMutation(api.announcements.createAnnouncement);
};

export const useUpdateAnnouncement = () => {
  return useMutation(api.announcements.updateAnnouncement);
};

export const useDeleteAnnouncement = () => {
  return useMutation(api.announcements.deleteAnnouncement);
};

export const useToggleAnnouncementPublication = () => {
  return useMutation(api.announcements.toggleAnnouncementPublication);
};

export const useUpdateSortOrder = () => {
  return useMutation(api.announcements.updateSortOrder);
};

// Type exports
export type AnnouncementData = {
  _id: Id<"announcements">;
  _creationTime: number;
  title: string;
  content: string;
  featuredImage?: string;
  isPublished: boolean;
  publishedAt: number;
  sortOrder: number;
  updatedAt: number;
};

export type CreateAnnouncementData = {
  title: string;
  content: string;
  featuredImage?: string;
  isPublished: boolean;
  sortOrder: number;
};

export type UpdateAnnouncementData = {
  id: Id<"announcements">;
  title: string;
  content: string;
  featuredImage?: string;
  isPublished: boolean;
  sortOrder: number;
};