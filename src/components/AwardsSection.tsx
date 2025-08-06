import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trophy, Award, Filter } from 'lucide-react';
import AwardCard from './AwardCard';
import AwardModal from './AwardModal';
import { 
  usePublishedAwards, 
  useAwardCategoriesWithCounts, 
  AwardData, 
  AwardCategory 
} from '@/services/convexAwardService';
import { useMobileDetection } from '@/hooks/useMobileDetection';

const AwardsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<AwardCategory | "all">("all");
  const [selectedAward, setSelectedAward] = useState<AwardData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAllAwards, setShowAllAwards] = useState(false);

  const { isMobile } = useMobileDetection();
  const awards = usePublishedAwards(undefined, selectedCategory);
  const categories = useAwardCategoriesWithCounts();

  // Filter awards based on display limit
  const displayedAwards = useMemo(() => {
    if (!awards) return [];
    
    if (showAllAwards) {
      return awards;
    }
    
    // Show 6 awards initially, 9 on larger screens
    const limit = isMobile ? 6 : 9;
    return awards.slice(0, limit);
  }, [awards, showAllAwards, isMobile]);

  const handleAwardClick = (award: AwardData) => {
    setSelectedAward(award);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAward(null);
  };

  const handleCategoryChange = (category: AwardCategory | "all") => {
    setSelectedCategory(category);
    setShowAllAwards(false); // Reset show all when changing categories
  };

  if (!categories || categories.length === 0) {
    return null; // Don't show section if no awards
  }

  const totalAwards = awards?.length || 0;
  const hasMoreAwards = totalAwards > displayedAwards.length;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4"
          >
            <Trophy className="h-4 w-4" />
            Награди и признания
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4"
          >
            Нашите
            <span className="text-primary"> постижения</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Гордеем се с признанията, които нашите котки получават на международни изложби и шампионати
          </motion.p>
        </div>

        {/* Category Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          {isMobile ? (
            // Mobile: Horizontal scroll
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Филтрирай по категория:</span>
              </div>
              <ScrollArea className="w-full">
                <div className="flex gap-2 pb-2">
                  {categories.map((category) => (
                    <Button
                      key={category.key}
                      variant={selectedCategory === category.key ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleCategoryChange(category.key as AwardCategory | "all")}
                      className="flex-shrink-0 whitespace-nowrap touch-manipulation min-h-[44px]"
                    >
                      {category.label}
                      {category.count > 0 && (
                        <span className="ml-1 text-xs bg-background/20 px-1.5 py-0.5 rounded-full">
                          {category.count}
                        </span>
                      )}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          ) : (
            // Desktop: Centered buttons
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {categories.map((category) => (
                <Button
                  key={category.key}
                  variant={selectedCategory === category.key ? "default" : "outline"}
                  onClick={() => handleCategoryChange(category.key as AwardCategory | "all")}
                  className="flex items-center gap-2"
                >
                  {category.label}
                  {category.count > 0 && (
                    <span className="text-xs bg-background/20 px-1.5 py-0.5 rounded-full">
                      {category.count}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Awards Grid */}
        {displayedAwards.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-8"
          >
            {displayedAwards.map((award, index) => (
              <motion.div
                key={award._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <AwardCard 
                  award={award} 
                  onClick={handleAwardClick}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {selectedCategory === "all" 
                ? "Все още няма публикувани награди." 
                : "Няма награди в тази категория."
              }
            </p>
          </div>
        )}

        {/* Show More Button */}
        {hasMoreAwards && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center"
          >
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setShowAllAwards(true)}
              className="bg-background border-border text-foreground hover:bg-muted min-h-[44px] px-8"
            >
              Покажи всички {totalAwards} награди
            </Button>
          </motion.div>
        )}

        {/* Award Modal */}
        <AwardModal
          award={selectedAward}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </section>
  );
};

export default AwardsSection;