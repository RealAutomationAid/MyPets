import { Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLatestAnnouncements, AnnouncementData } from '@/services/convexAnnouncementService';

const NewsSection = () => {
  const latestNews = useLatestAnnouncements(3); // Get latest 3 announcements

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('bg-BG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const generateSlug = (title: string, id: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    return slug || id;
  };


  // Show loading state while data is being fetched
  if (latestNews === undefined) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Новини от
              <span className="text-primary"> BleuRoi Ragdoll Cattery</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Следете последните новини и събития от нашето семейство
            </p>
          </div>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">Зареждане на новини...</span>
          </div>
        </div>
      </section>
    );
  }

  // Show section with placeholder when no news exists
  if (latestNews.length === 0) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Новини от
              <span className="text-primary"> BleuRoi Ragdoll Cattery</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Следете последните новини и събития от нашето семейство
            </p>
          </div>
          <div className="text-center py-12">
            <div className="bg-muted/50 rounded-lg p-8 max-w-md mx-auto">
              <div className="text-muted-foreground mb-3">📰</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Скоро ще има новини
              </h3>
              <p className="text-sm text-muted-foreground">
                Нови истории и събития ще бъдат споделени скоро
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Новини от
            <span className="text-primary"> BleuRoi Ragdoll Cattery</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Следете последните новини и събития от нашето семейство
          </p>
        </div>

        {/* News Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {latestNews.map((announcement) => (
            <Link 
              key={announcement._id} 
              to={`/news/${announcement.slug || generateSlug(announcement.title, announcement._id)}`}
            >
              <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer hover:scale-[1.02]">
              {announcement.featuredImage && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={announcement.featuredImage}
                    alt={announcement.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Calendar className="h-4 w-4" />
                  <time>{formatDate(announcement.publishedAt)}</time>
                </div>
                
                <h3 className="font-semibold text-lg text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {announcement.title}
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-4 mb-4">
                  {announcement.content}
                </p>

                <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all duration-200">
                  <span>Прочети повече</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Show More Button */}
        {latestNews.length >= 3 && (
          <div className="text-center mt-12">
            <Link to="/news">
              <Button 
                variant="outline" 
                size="lg"
                className="bg-background border-border text-foreground hover:bg-muted min-h-[44px] px-8"
              >
                Вижте всички новини
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;