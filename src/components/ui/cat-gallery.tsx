"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { InteractiveGallery } from "@/components/ui/interactive-gallery";
import { useDisplayedCatsByCategory } from "@/services/convexCatService";
import { CatData } from "@/services/convexCatService";
import { getFallbackRagdollCatsWithIds } from "@/data/fallbackRagdollCats";
import CatStatusTag from "./cat-status-tag";
import { useLanguage } from "@/hooks/useLanguage";

type CategoryFilter = 'all' | 'kitten' | 'adult';

export default function CatGallery() {
  const { t } = useLanguage();
  
  const categoryLabels = {
    all: t('gallery.categories.all'),
    kitten: t('gallery.categories.kitten'),
    adult: t('gallery.categories.adult')
  };
  const [isVisible, setIsVisible] = useState(true);
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const ref = useRef(null);

  // Fetch cats based on selected category with fallback to Ragdoll examples
  const databaseCats = useDisplayedCatsByCategory(activeFilter);
  const fallbackCats = getFallbackRagdollCatsWithIds(activeFilter);
  
  // Use database cats if available, otherwise show fallback Ragdoll cats
  const cats = (databaseCats && databaseCats.length > 0) ? databaseCats : fallbackCats;

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Convert cat data to card format for LayoutGrid
  const createCatCards = (catData: CatData[]) => {
    if (!catData || catData.length === 0) {
      return [];
    }

    return catData.map((cat, index) => ({
      id: cat._id,
      content: (
        <div>
          {/* Status Tag at the top */}
          <div className="mb-3">
            <CatStatusTag status={cat.status} variant="compact" />
          </div>
          
          <p className="font-bold md:text-4xl text-xl text-white">
            {cat.name}
          </p>
          <p className="font-normal text-base text-white uppercase tracking-wide">
            {cat.subtitle}
          </p>
          <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
            {cat.description}
          </p>
          <div className="text-sm text-neutral-300 space-y-1">
            <p>Възраст: {cat.age}</p>
            <p>Цвят: {cat.color}</p>
            <p>Пол: {cat.gender === 'male' ? 'Мъжки' : 'Женски'}</p>
            <p>Статус: {cat.status}</p>
          </div>
        </div>
      ),
      className: getCardClassName(index, catData.length),
      thumbnail: cat.image,
    }));
  };

  // Dynamic grid layout based on number of cats
  const getCardClassName = (index: number, total: number) => {
    // Create a balanced layout similar to the original design
    if (total === 1) return "md:col-span-3";
    if (total === 2) return index === 0 ? "md:col-span-2" : "col-span-1";
    if (total === 3) return "col-span-1";
    
    // For 4+ cats, use the original pattern
    const patterns = ["md:col-span-2", "col-span-1", "col-span-1", "md:col-span-2"];
    return patterns[index % patterns.length] || "col-span-1";
  };

  const cards = createCatCards(cats || []);

  return (
    <div 
      ref={ref}
      className="py-20 w-full"
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm text-muted-foreground tracking-wide uppercase mb-2">
            {t('gallery.subtitle')}
          </p>
          <h2 className="font-playfair text-4xl lg:text-5xl font-light text-foreground">
            {t('gallery.title')}
          </h2>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-1 bg-muted/50 p-1 rounded-lg">
            {(Object.entries(categoryLabels) as [CategoryFilter, string][]).map(([category, label]) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeFilter === category
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="w-full">
          {cards.length > 0 ? (
            <InteractiveGallery cards={cards} className="min-h-[600px]" />
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                Зареждане на нашите прекрасни рагдол котки...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}