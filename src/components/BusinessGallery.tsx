"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useLanguage } from "@/hooks/useLanguage";
import { Award, FileText, Camera, Trophy, Badge, Star, ExternalLink, Heart, Share2 } from "lucide-react";

type BusinessGalleryItem = {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: 'award' | 'certificate' | 'photo' | 'trophy';
  description?: string;
  date?: string;
  height?: 'small' | 'medium' | 'large'; // For masonry layout
};

// Mock data for demonstration - this would come from the database in production
const mockGalleryItems: BusinessGalleryItem[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&auto=format',
    alt: 'Best Cattery Award 2024',
    title: 'Best Cattery Award 2024',
    category: 'award',
    description: 'Awarded for excellence in Ragdoll breeding and care',
    date: '2024',
    height: 'medium'
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=600&fit=crop&auto=format',
    alt: 'TICA Registration Certificate',
    title: 'TICA Registration Certificate',
    category: 'certificate',
    description: 'Official TICA cattery registration certificate',
    date: '2023',
    height: 'large'
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1561948955-570b270e7c36?w=400&h=400&fit=crop&auto=format',
    alt: 'Champion Ragdoll at Show',
    title: 'Champion at Regional Show',
    category: 'photo',
    description: 'Our beautiful Ragdoll winning first place',
    date: '2024',
    height: 'small'
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400&h=600&fit=crop&auto=format',
    alt: 'First Place Trophy',
    title: 'Championship Trophy',
    category: 'trophy',
    description: 'First place at the International Cat Show',
    date: '2024',
    height: 'medium'
  },
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=700&fit=crop&auto=format',
    alt: 'Ragdoll Kittens',
    title: 'New Litter of Champions',
    category: 'photo',
    description: 'Our latest litter showing perfect Ragdoll characteristics',
    date: '2024',
    height: 'large'
  },
  {
    id: '6',
    src: 'https://images.unsplash.com/photo-1594736797933-d0301ba8807d?w=400&h=400&fit=crop&auto=format',
    alt: 'Excellence in Breeding Award',
    title: 'Excellence in Breeding',
    category: 'award',
    description: 'Recognition for maintaining breed standards',
    date: '2023',
    height: 'small'
  },
  {
    id: '7',
    src: 'https://images.unsplash.com/photo-1562013307-b33cb8ad4835?w=400&h=600&fit=crop&auto=format',
    alt: 'Breeder Excellence Certificate',
    title: 'Breeder Excellence Certificate',
    category: 'certificate',
    description: 'Certified excellence in Ragdoll breeding standards',
    date: '2024',
    height: 'medium'
  },
  {
    id: '8',
    src: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=600&fit=crop&auto=format',
    alt: 'International Trophy',
    title: 'International Cat Show Victory',
    category: 'trophy',
    description: 'Grand champion at international competition',
    date: '2024',
    height: 'large'
  }
];

const categoryConfig = {
  award: { 
    icon: Award, 
    label: 'Awards', 
    color: 'text-amber-500', 
    bgColor: 'bg-amber-50 border-amber-200',
    hoverColor: 'hover:bg-amber-100',
    activeColor: 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg shadow-amber-500/25'
  },
  certificate: { 
    icon: FileText, 
    label: 'Certificates', 
    color: 'text-blue-500', 
    bgColor: 'bg-blue-50 border-blue-200',
    hoverColor: 'hover:bg-blue-100',
    activeColor: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
  },
  photo: { 
    icon: Camera, 
    label: 'Photos', 
    color: 'text-emerald-500', 
    bgColor: 'bg-emerald-50 border-emerald-200',
    hoverColor: 'hover:bg-emerald-100',
    activeColor: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25'
  },
  trophy: { 
    icon: Trophy, 
    label: 'Trophies', 
    color: 'text-purple-500', 
    bgColor: 'bg-purple-50 border-purple-200',
    hoverColor: 'hover:bg-purple-100',
    activeColor: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/25'
  }
};

type CategoryFilter = 'all' | 'award' | 'certificate' | 'photo' | 'trophy';

export default function BusinessGallery() {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // In production, this would query the database for business gallery images
  // const businessImages = useQuery(api.images.getBusinessGalleryImages);
  
  // Filter items based on selected category
  const filteredItems = activeFilter === 'all' 
    ? mockGalleryItems 
    : mockGalleryItems.filter(item => item.category === activeFilter);

  const categoryLabels = {
    all: t('businessGallery.categories.all') || 'All',
    award: categoryConfig.award.label,
    certificate: categoryConfig.certificate.label,
    photo: categoryConfig.photo.label,
    trophy: categoryConfig.trophy.label
  };

  return (
    <div className="py-16 w-full bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.div
            className="flex items-center justify-center gap-2 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Trophy className="w-6 h-6 text-yellow-600" />
            <p className="text-sm text-muted-foreground tracking-wide uppercase font-medium">
              {t('businessGallery.subtitle') || 'Our Achievements'}
            </p>
            <Badge className="w-6 h-6 text-purple-600" />
          </motion.div>
          
          <motion.h2 
            className="font-playfair text-3xl lg:text-4xl font-light text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {t('businessGallery.title') || 'Awards & Recognition'}
          </motion.h2>
          
          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t('businessGallery.description') || 'Celebrating our journey of excellence in Ragdoll breeding, showcasing awards, certificates, and memorable moments.'}
          </motion.p>
        </div>

        {/* Category Filter Pills */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {(Object.entries(categoryLabels) as [CategoryFilter, string][]).map(([category, label]) => {
            const categorySettings = category !== 'all' ? categoryConfig[category as keyof typeof categoryConfig] : null;
            const IconComponent = categorySettings?.icon || Star;
            const isActive = activeFilter === category;
            
            return (
              <motion.button
                key={category}
                onClick={() => setActiveFilter(category)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-all duration-300 backdrop-blur-sm border-2 ${
                  isActive
                    ? category === 'all' 
                      ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-lg shadow-slate-500/25 border-slate-500'
                      : categorySettings?.activeColor || 'bg-primary text-primary-foreground shadow-lg'
                    : category === 'all'
                      ? 'bg-white/70 text-slate-700 hover:bg-white/90 shadow-md border-slate-200 hover:border-slate-300'
                      : `${categorySettings?.bgColor || 'bg-white/70'} ${categorySettings?.color || 'text-muted-foreground'} ${categorySettings?.hoverColor || 'hover:bg-white/90'} shadow-md border-2`
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {label}
                {category !== 'all' && (
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                    isActive 
                      ? 'bg-white/20 text-white'
                      : 'bg-white/60 text-slate-600'
                  }`}>
                    {mockGalleryItems.filter(item => item.category === category).length}
                  </span>
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Masonry Gallery Grid */}
        <motion.div 
          className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {filteredItems.map((item, index) => {
            const categorySettings = categoryConfig[item.category];
            const IconComponent = categorySettings.icon;
            const categoryColor = categorySettings.color;
            
            return (
              <motion.div
                key={item.id}
                className={`break-inside-avoid mb-6 group cursor-pointer ${
                  item.height === 'small' ? 'h-64' :
                  item.height === 'large' ? 'h-96' : 'h-80'
                }`}
                onHoverStart={() => setHoveredItem(item.id)}
                onHoverEnd={() => setHoveredItem(null)}
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
                {/* Card Container */}
                <div className="relative h-full rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 backdrop-blur-sm">
                  {/* Image */}
                  <div className="relative h-2/3 overflow-hidden">
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        // Fallback for missing images based on category
                        const fallbackImages = {
                          award: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=600&fit=crop&auto=format',
                          trophy: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400&h=600&fit=crop&auto=format',
                          certificate: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=600&fit=crop&auto=format',
                          photo: 'https://images.unsplash.com/photo-1561948955-570b270e7c36?w=400&h=600&fit=crop&auto=format'
                        };
                        e.currentTarget.src = fallbackImages[item.category] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDQwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMjUwSDIyMFYzNTBIMjAwVjI1MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                      }}
                    />
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Category icon */}
                    <div className="absolute top-3 left-3 z-20">
                      <div className={`w-11 h-11 rounded-full bg-white/90 backdrop-blur-md border-2 border-white/50 flex items-center justify-center ${categoryColor} shadow-lg`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                    </div>
                    
                    {/* Action buttons on hover */}
                    <motion.div
                      className="absolute top-3 right-3 flex gap-2 z-20"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: hoveredItem === item.id ? 1 : 0,
                        scale: hoveredItem === item.id ? 1 : 0.8
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <button className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors">
                        <Heart className="w-4 h-4 text-white" />
                      </button>
                      <button className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors">
                        <Share2 className="w-4 h-4 text-white" />
                      </button>
                      <button className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors">
                        <ExternalLink className="w-4 h-4 text-white" />
                      </button>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="p-4 h-1/3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-sm font-bold text-foreground line-clamp-2">
                          {item.title}
                        </h3>
                        {item.date && (
                          <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full shrink-0">
                            {item.date}
                          </span>
                        )}
                      </div>
                      
                      {item.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                    
                    {/* Category tag */}
                    <div className="flex items-center gap-2 pt-2 border-t border-muted/20">
                      <IconComponent className={`w-3 h-3 ${categoryColor}`} />
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {categorySettings.label}
                      </span>
                    </div>
                  </div>
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
        
        {/* Bottom decorative element */}
        <motion.div 
          className="mt-16 flex items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-amber-500/60" />
              <div className="w-12 h-px bg-gradient-to-r from-amber-300/40 to-transparent"></div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="w-5 h-5 text-purple-500/60" />
              <div className="w-16 h-px bg-gradient-to-r from-purple-300/40 via-indigo-300/40 to-blue-300/40"></div>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-blue-500/60" />
              <div className="w-16 h-px bg-gradient-to-r from-blue-300/40 via-emerald-300/40 to-emerald-300/40"></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-12 h-px bg-gradient-to-l from-emerald-300/40 to-transparent"></div>
              <FileText className="w-5 h-5 text-emerald-500/60" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}