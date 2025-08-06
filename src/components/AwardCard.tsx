import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Award, Building2 } from 'lucide-react';
import { AwardData, formatAwardDate, getCategoryLabel, getCategoryColor } from '@/services/convexAwardService';
import { useMobileDetection } from '@/hooks/useMobileDetection';

interface AwardCardProps {
  award: AwardData;
  onClick: (award: AwardData) => void;
}

const AwardCard = ({ award, onClick }: AwardCardProps) => {
  const [isTouched, setIsTouched] = useState(false);
  const { isMobile } = useMobileDetection();

  const handleClick = () => {
    onClick(award);
  };

  const cardContent = (
    <Card 
      className="group relative overflow-hidden cursor-pointer bg-card shadow-card hover:shadow-lg transition-all duration-300"
      onClick={handleClick}
    >
      {/* Certificate Image */}
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={award.certificateImage}
          alt={`Сертификат за ${award.title}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Category Badge Overlay */}
        <div className="absolute top-3 left-3">
          <Badge 
            variant="secondary" 
            className={`${getCategoryColor(award.category)} font-medium`}
          >
            {getCategoryLabel(award.category)}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 sm:p-6">
        {/* Award Details */}
        <div className="space-y-3">
          {/* Title */}
          <h3 className="font-playfair text-lg sm:text-xl font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {award.title}
          </h3>

          {/* Organization */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1">{award.awardingOrganization}</span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <time>{formatAwardDate(award.awardDate)}</time>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
            {award.description}
          </p>

          {/* Gallery Count Indicator */}
          {award.galleryImages.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Award className="h-3 w-3" />
              <span>+{award.galleryImages.length} снимки</span>
            </div>
          )}
        </div>

        {/* Hover/Touch Indicator */}
        <div className="mt-4 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span>Вижте повече</span>
          <motion.div
            animate={{ x: isTouched ? 4 : 0 }}
            transition={{ duration: 0.2 }}
            className="ml-2"
          >
            →
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );

  // Mobile: Add touch feedback
  if (isMobile) {
    return (
      <motion.div
        onTouchStart={() => setIsTouched(true)}
        onTouchEnd={() => setIsTouched(false)}
        animate={{
          scale: isTouched ? 0.98 : 1,
          y: isTouched ? 2 : 0
        }}
        transition={{ duration: 0.15 }}
        className="touch-manipulation"
      >
        {cardContent}
      </motion.div>
    );
  }

  // Desktop: Standard hover effects
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {cardContent}
    </motion.div>
  );
};

export default AwardCard;