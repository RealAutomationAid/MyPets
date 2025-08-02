import { Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnnouncementData } from '@/services/convexAnnouncementService';

interface AnnouncementModalProps {
  announcement: AnnouncementData | null;
  isOpen: boolean;
  onClose: () => void;
}

const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  announcement,
  isOpen,
  onClose
}) => {
  if (!isOpen || !announcement) return null;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('bg-BG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatContent = (content: string) => {
    // Split content by line breaks and create paragraphs
    return content.split('\n').filter(line => line.trim()).map((paragraph, index) => (
      <p key={index} className="mb-4 leading-relaxed">
        {paragraph}
      </p>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal Header */}
        <div className="relative">
          {announcement.featuredImage && (
            <div className="aspect-video overflow-hidden rounded-t-2xl">
              <img
                src={announcement.featuredImage}
                alt={announcement.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* Close Button */}
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-white/90 hover:bg-white text-ragdoll-gray-dark rounded-full shadow-lg"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Modal Content */}
        <div className="p-8">
          {/* Title */}
          <h1 className="font-playfair text-3xl font-bold text-foreground mb-4">
            {announcement.title}
          </h1>

          {/* Date and Meta Info */}
          <div className="flex items-center gap-2 text-muted-foreground mb-6 pb-4 border-b border-border">
            <Calendar className="h-4 w-4" />
            <time className="text-sm">
              Публикувано на {formatDate(announcement.publishedAt)}
            </time>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-foreground">
              {formatContent(announcement.content)}
            </div>
          </div>

          {/* Footer with action buttons */}
          <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              BleuRoi Ragdoll Cattery
            </div>
            <Button 
              onClick={onClose}
              variant="outline"
              className="bg-ragdoll-blue text-white border-ragdoll-blue hover:bg-ragdoll-blue/90 hover:border-ragdoll-blue/90"
            >
              Затвори
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementModal;