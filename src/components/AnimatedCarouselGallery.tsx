"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { useDisplayedCatsByCategory } from "@/services/convexCatService";
import { CatData } from "@/services/convexCatService";
import { getFallbackRagdollCatsWithIds } from "@/data/fallbackRagdollCats";
import CatStatusTag from "./ui/cat-status-tag";
import { useLanguage } from "@/hooks/useLanguage";
import RagdollImage from "./ui/RagdollImage";
import { Eye, Heart, Share2 } from "lucide-react";

type CategoryFilter = 'all' | 'kitten' | 'adult';

export default function AnimatedCarouselGallery() {
  const { t } = useLanguage();
  
  const categoryLabels = {
    all: t('gallery.categories.all'),
    kitten: t('gallery.categories.kitten'),
    adult: t('gallery.categories.adult')
  };
  
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Fetch cats based on selected category with fallback to Ragdoll examples
  const databaseCats = useDisplayedCatsByCategory(activeFilter);
  const fallbackCats = getFallbackRagdollCatsWithIds(activeFilter);
  
  // Use database cats if available, otherwise show fallback Ragdoll cats
  const cats = (databaseCats && databaseCats.length > 0) ? databaseCats : fallbackCats;

  if (!cats || cats.length === 0) {
    return (
      <div className="py-12 w-full">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center">
            <p className="text-muted-foreground text-lg">
              Зареждане на нашите прекрасни рагдол котки...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 w-full bg-gradient-ragdoll">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.p 
            className="text-sm text-muted-foreground tracking-wide uppercase mb-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {t('gallery.subtitle')}
          </motion.p>
          <motion.h2 
            className="font-playfair text-3xl lg:text-4xl font-light text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {t('gallery.title')}
          </motion.h2>
        </div>

        {/* Category Filter Tabs */}
        <motion.div 
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex space-x-1 bg-white/60 backdrop-blur-sm p-1 rounded-lg border border-white/20 shadow-sm">
            {(Object.entries(categoryLabels) as [CategoryFilter, string][]).map(([category, label]) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-300 touch-manipulation ${
                  activeFilter === category
                    ? 'bg-primary text-primary-foreground shadow-md scale-105'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>
        
        {/* Responsive Grid Gallery */}
        <motion.div 
          className="gallery-grid"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8">
            {cats.map((cat, index) => (
              <motion.div
                key={cat._id}
                className="gallery-item group relative rounded-2xl overflow-hidden cursor-pointer bg-card shadow-card"
                onHoverStart={() => setHoveredCard(cat._id)}
                onHoverEnd={() => setHoveredCard(null)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden flex items-center justify-center bg-muted">
                  <RagdollImage
                    src={cat.image}
                    className="max-w-full max-h-full object-contain transition-transform duration-700"
                    alt={cat.name}
                    fallbackSrc="/placeholder.svg"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Status Tag */}
                  <div className="absolute top-3 left-3 z-20">
                    <CatStatusTag status={cat.status} variant="compact" />
                  </div>
                  
                  {/* Action buttons on hover */}
                  <motion.div
                    className="absolute top-3 right-3 flex gap-2 z-20"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: hoveredCard === cat._id ? 1 : 0,
                      scale: hoveredCard === cat._id ? 1 : 0.8
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <button className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors touch-manipulation">
                      <Heart className="w-4 h-4 text-white" />
                    </button>
                    <button className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors touch-manipulation">
                      <Share2 className="w-4 h-4 text-white" />
                    </button>
                  </motion.div>
                  
                  {/* View button on hover */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center z-20"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: hoveredCard === cat._id ? 1 : 0,
                      scale: hoveredCard === cat._id ? 1 : 0.8
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <button className="px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white font-medium flex items-center gap-2 transition-all duration-300 hover:scale-105 touch-manipulation">
                      <Eye className="w-4 h-4" />
                      Виж повече
                    </button>
                  </motion.div>
                </div>

                {/* Cat Info */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-foreground mb-1 truncate">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide mb-3 truncate">
                    {cat.subtitle}
                  </p>
                  
                  {/* Additional info - visible on hover for desktop, always visible on mobile */}
                  <motion.div
                    className="sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  >
                    <div className="flex gap-4 text-xs text-muted-foreground mb-2">
                      <span>{cat.age}</span>
                      <span>{cat.color}</span>
                      <span>{cat.gender === 'male' ? 'Мъжки' : 'Женски'}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {cat.description}
                    </p>
                  </motion.div>
                </div>
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000" />
              </motion.div>
            ))}
          </div>
          
          {/* Bottom decorative line */}
          <motion.div 
            className="mt-12 flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-muted-foreground/30"></div>
              <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-pulse"></div>
              <div className="w-16 h-px bg-muted-foreground/30"></div>
              <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-pulse"></div>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-muted-foreground/30"></div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}