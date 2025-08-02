import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

// Query hooks for site settings
export const useAllSiteSettings = () => {
  return useQuery(api.siteSettings.getAllSettings);
};

export const useSettingsByType = (type: 'social_media' | 'contact_info' | 'site_content' | 'feature_toggle' | 'analytics' | 'seo') => {
  return useQuery(api.siteSettings.getSettingsByType, { type });
};

export const useSettingByKey = (key: string) => {
  return useQuery(api.siteSettings.getSettingByKey, { key });
};

export const useSocialMediaSettings = () => {
  return useQuery(api.siteSettings.getSocialMediaSettings);
};

// Mutation hooks for site settings
export const useUpsertSetting = () => {
  return useMutation(api.siteSettings.upsertSetting);
};

export const useUpdateSocialMediaSettings = () => {
  return useMutation(api.siteSettings.updateSocialMediaSettings);
};

export const useDeleteSetting = () => {
  return useMutation(api.siteSettings.deleteSetting);
};

export const useInitializeDefaultSettings = () => {
  return useMutation(api.siteSettings.initializeDefaultSettings);
};

// Type exports
export type SiteSettingType = 'social_media' | 'contact_info' | 'site_content' | 'feature_toggle' | 'analytics' | 'seo';

export type SiteSetting = {
  _id: Id<"siteSettings">;
  _creationTime: number;
  key: string;
  value: string;
  type: SiteSettingType;
  description?: string;
};

export type SocialMediaSettings = {
  facebook_url?: string;
  instagram_url?: string;
  tiktok_url?: string;
};