import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Tag } from 'lucide-react';
import { GalleryItem, getCategoryLabel, getCategoryColor, formatGalleryDate } from '@/services/convexGalleryService';

interface GalleryCardProps {
  item: GalleryItem;
  onClick: (item: GalleryItem) => void;
}

const GalleryCard = ({ item, onClick }: GalleryCardProps) => {
  return (
    <Card 
      className="group overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 border-border/50 hover:border-primary/50 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm"
      onClick={() => onClick(item)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <div className="aspect-[4/3] overflow-hidden flex items-center justify-center bg-muted">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="max-w-full max-h-full object-contain transition-opacity duration-300"
          />
        </div>
        
        {/* Overlay with category badge */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 left-3">
          <Badge 
            variant="secondary" 
            className={`${getCategoryColor(item.category)} font-medium shadow-lg backdrop-blur-sm`}
          >
            {getCategoryLabel(item.category)}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-playfair text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {item.title}
        </h3>

        {/* Description */}
        {item.description && (
          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}

        {/* Metadata */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
          {item.date && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatGalleryDate(item.date)}</span>
            </div>
          )}
          {item.tags && item.tags.length > 0 && (
            <div className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              <span>{item.tags.length} {item.tags.length === 1 ? 'таг' : 'тага'}</span>
            </div>
          )}
        </div>

        {/* Tags Preview */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {item.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
                {tag}
              </Badge>
            ))}
            {item.tags.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5 text-muted-foreground">
                +{item.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GalleryCard;