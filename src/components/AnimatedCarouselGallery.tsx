"use client";
import React, { useState, useRef, useEffect } from "react";
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
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch cats based on selected category with fallback to Ragdoll examples
  const databaseCats = useDisplayedCatsByCategory(activeFilter);
  const fallbackCats = getFallbackRagdollCatsWithIds(activeFilter);
  
  // Use database cats if available, otherwise show fallback Ragdoll cats
  const cats = (databaseCats && databaseCats.length > 0) ? databaseCats : fallbackCats;

  // Duplicate cats for infinite scroll effect
  const duplicatedCats = cats ? [...cats, ...cats, ...cats] : [];

  // Auto-scroll effect
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || !duplicatedCats.length) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5; // Adjust speed as needed

    const scroll = () => {
      scrollPosition += scrollSpeed;
      
      // Reset position when we've scrolled through one set of duplicated items
      const maxScroll = (duplicatedCats.length / 3) * 320; // 320px is approximate card width
      if (scrollPosition >= maxScroll) {
        scrollPosition = 0;
      }
      
      if (scrollContainer) {
        scrollContainer.scrollLeft = scrollPosition;
      }
      
      animationId = requestAnimationFrame(scroll);
    };

    // Start auto-scroll after a short delay
    const timeout = setTimeout(() => {
      animationId = requestAnimationFrame(scroll);
    }, 2000);

    // Pause on hover
    const handleMouseEnter = () => {
      cancelAnimationFrame(animationId);
    };

    const handleMouseLeave = () => {
      animationId = requestAnimationFrame(scroll);
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animationId);
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [duplicatedCats.length]);

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
    <div className="py-16 w-full overflow-hidden bg-gradient-to-b from-background to-muted/20">
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
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex space-x-1 bg-muted/50 p-1 rounded-lg backdrop-blur-sm">
            {(Object.entries(categoryLabels) as [CategoryFilter, string][]).map(([category, label]) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  activeFilter === category
                    ? 'bg-background text-foreground shadow-md scale-105'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/10'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>
        
        {/* Animated Carousel */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Gradient overlays for infinite scroll effect */}
          <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
          
          {/* Scrolling container */}
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-hidden scrollbar-hide"
            style={{ 
              scrollBehavior: 'auto',
            }}
          >
            {duplicatedCats.map((cat, index) => (
              <motion.div
                key={`${cat._id}-${index}`}
                className="flex-shrink-0 group relative w-72 h-80 rounded-2xl overflow-hidden cursor-pointer"
                onHoverStart={() => setHoveredCard(`${cat._id}-${index}`)}
                onHoverEnd={() => setHoveredCard(null)}
                whileHover={{ 
                  scale: 1.05,
                  y: -10,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: (index % 10) * 0.1 }}
              >
                {/* Background Image */}
                <RagdollImage
                  src={cat.image}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt={cat.name}
                  fallbackSrc="/placeholder.svg"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Glassmorphism overlay on hover */}
                <motion.div 
                  className="absolute inset-0 bg-white/10 backdrop-blur-sm border border-white/20"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: hoveredCard === `${cat._id}-${index}` ? 1 : 0 
                  }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Status Tag */}
                <div className="absolute top-4 left-4 z-20">
                  <CatStatusTag status={cat.status} variant="compact" />
                </div>
                
                {/* Action buttons on hover */}
                <motion.div
                  className="absolute top-4 right-4 flex gap-2 z-20"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ 
                    opacity: hoveredCard === `${cat._id}-${index}` ? 1 : 0,
                    y: hoveredCard === `${cat._id}-${index}` ? 0 : -20
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors">
                    <Heart className="w-4 h-4 text-white" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors">
                    <Share2 className="w-4 h-4 text-white" />
                  </button>
                </motion.div>
                
                {/* Cat info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20">
                  <motion.h3 
                    className="text-xl font-bold mb-1"
                    initial={{ opacity: 1 }}
                    animate={{ 
                      scale: hoveredCard === `${cat._id}-${index}` ? 1.1 : 1
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {cat.name}
                  </motion.h3>
                  <p className="text-sm text-neutral-200 uppercase tracking-wide mb-2">
                    {cat.subtitle}
                  </p>
                  
                  {/* Extended info on hover */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ 
                      opacity: hoveredCard === `${cat._id}-${index}` ? 1 : 0,
                      height: hoveredCard === `${cat._id}-${index}` ? 'auto' : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-xs text-neutral-300 mb-2 line-clamp-2">
                      {cat.description}
                    </p>
                    <div className="flex gap-4 text-xs text-neutral-300">
                      <span>{cat.age}</span>
                      <span>{cat.color}</span>
                      <span>{cat.gender === 'male' ? 'Мъжки' : 'Женски'}</span>
                    </div>
                  </motion.div>
                </div>
                
                {/* View button on hover */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center z-20"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ 
                    opacity: hoveredCard === `${cat._id}-${index}` ? 1 : 0,
                    scale: hoveredCard === `${cat._id}-${index}` ? 1 : 0.5
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <button className="px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white font-medium flex items-center gap-2 transition-all duration-300 hover:scale-105">
                    <Eye className="w-4 h-4" />
                    Виж повече
                  </button>
                </motion.div>
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000" />
              </motion.div>
            ))}
          </div>
          
          {/* Bottom decorative line */}
          <motion.div 
            className="mt-8 flex items-center justify-center"
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