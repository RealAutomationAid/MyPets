import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Play } from "lucide-react";
import { useTikTokVideosByCat } from "@/services/convexTikTokService";
import { Id } from "../../convex/_generated/dataModel";

interface CatTikTokVideosProps {
  catId: Id<"cats"> | string;
  catName: string;
}

const CatTikTokVideos = ({ catId, catName }: CatTikTokVideosProps) => {
  const videos = useTikTokVideosByCat(catId);

  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-muted-foreground">
          TikTok видеа ({videos.length})
        </h4>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {videos.slice(0, 4).map((video) => (
          <div
            key={video._id}
            className="relative aspect-video bg-muted rounded-lg overflow-hidden group cursor-pointer"
            onClick={() => window.open(video.videoUrl, '_blank')}
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            
            {/* Play Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white/90 rounded-full p-2">
                  <Play className="w-4 h-4 text-black" />
                </div>
              </div>
            </div>

            {/* Video Stats */}
            <div className="absolute bottom-1 left-1 right-1">
              <div className="bg-black/60 text-white text-xs px-2 py-1 rounded">
                <p className="font-medium truncate">{video.title}</p>
                {video.viewCount && (
                  <p className="text-xs opacity-80">
                    👁️ {video.viewCount.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {videos.length > 4 && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            // Could open a dedicated videos modal or navigate to a videos page
            alert(`${catName} има общо ${videos.length} TikTok видеа`);
          }}
        >
          Виж всички {videos.length} видеа
        </Button>
      )}
    </div>
  );
};

export default CatTikTokVideos;