import React, { useState } from 'react';
import { Play, Heart, MessageCircle, Share, Bookmark, MoreHorizontal, ExternalLink } from 'lucide-react';
import { useTikTokVideosForMainSection } from '@/services/convexTikTokService';
import { useLanguage } from '@/hooks/useLanguage';

// Fallback static TikTok videos when no database content is available
const FALLBACK_VIDEOS = [
  {
    _id: 'fallback-1',
    title: 'Красиви Ragdoll котки',
    description: 'Нашите прекрасни котки в техния дом',
    thumbnail: '/placeholder.svg',
    videoUrl: 'https://www.tiktok.com/@radanovprideragdoll',
    hashtags: ['#ragdoll', '#котки', '#радановпрайд'],
    viewCount: 12500,
    likeCount: 850,
    commentCount: 45,
    isActive: true,
    catId: undefined,
  },
  {
    _id: 'fallback-2',
    title: 'Игриви момичета котенца',
    description: 'Котенцата си играят заедно',
    thumbnail: '/placeholder.svg',
    videoUrl: 'https://www.tiktok.com/@radanovprideragdoll',
    hashtags: ['#котенца', '#игра', '#сладки'],
    viewCount: 8900,
    likeCount: 620,
    commentCount: 32,
    isActive: true,
    catId: undefined,
  },
  {
    _id: 'fallback-3',
    title: 'Ragdoll семейство',
    description: 'Майка с котенца - сърчицетопящи моменти',
    thumbnail: '/placeholder.svg',
    videoUrl: 'https://www.tiktok.com/@radanovprideragdoll',
    hashtags: ['#семейство', '#майка', '#котенца'],
    viewCount: 15600,
    likeCount: 1200,
    commentCount: 78,
    isActive: true,
    catId: undefined,
  },
  {
    _id: 'fallback-4',
    title: 'Красота и елегантност',
    description: 'Възрастни котки показват своята красота',
    thumbnail: '/placeholder.svg',
    videoUrl: 'https://www.tiktok.com/@radanovprideragdoll',
    hashtags: ['#красота', '#елегантност', '#ragdoll'],
    viewCount: 9300,
    likeCount: 470,
    commentCount: 28,
    isActive: true,
    catId: undefined,
  },
  {
    _id: 'fallback-5',
    title: 'Дневна рутина на котките',
    description: 'Как прекарват деня нашите котки',
    thumbnail: '/placeholder.svg',
    videoUrl: 'https://www.tiktok.com/@radanovprideragdoll',
    hashtags: ['#рутина', '#ден', '#живот'],
    viewCount: 6800,
    likeCount: 340,
    commentCount: 19,
    isActive: true,
    catId: undefined,
  },
  {
    _id: 'fallback-6',
    title: 'Най-добрите моменти',
    description: 'Компилация от най-сладките моменти',
    thumbnail: '/placeholder.svg',
    videoUrl: 'https://www.tiktok.com/@radanovprideragdoll',
    hashtags: ['#моменти', '#компилация', '#сладко'],
    viewCount: 11200,
    likeCount: 890,
    commentCount: 56,
    isActive: true,
    catId: undefined,
  },
];

const TikTokSection = () => {
  const { t } = useLanguage();
  const videos = useTikTokVideosForMainSection(6);
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());
  
  // Three-tier fallback system: cat-specific videos → global admin videos → hardcoded fallback videos
  const displayVideos = (() => {
    if (videos && videos.length > 0) {
      return videos; // Use database videos (cat-specific + global)
    }
    return FALLBACK_VIDEOS; // Use fallback videos when no database content
  })();

  const handleLike = (videoId: string) => {
    setLikedVideos(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(videoId)) {
        newLiked.delete(videoId);
      } else {
        newLiked.add(videoId);
      }
      return newLiked;
    });
  };

  const formatCount = (count?: number) => {
    if (!count) return '0';
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <section className="bg-black py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('tiktok.title')}
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            {t('tiktok.subtitle')}
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-12">
          {displayVideos.map((video) => (
            <div key={video._id} className="relative group">
              {/* Video Card */}
              <div 
                className="relative bg-gray-900 rounded-lg overflow-hidden aspect-[9/16] cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => window.open(video.videoUrl, '_blank')}
                >
                  {/* Thumbnail */}
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-50 transition-all">
                    <div className="bg-white bg-opacity-90 rounded-full p-3 hover:bg-opacity-100 transition-all duration-200 group-hover:scale-110">
                      <Play className="w-8 h-8 text-black ml-1" fill="currentColor" />
                    </div>
                  </div>

                  {/* External Link Icon */}
                  <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black bg-opacity-70 text-white p-1 rounded">
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Bottom Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/70 to-transparent">
                    {/* User Info */}
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mr-2">
                        <span className="text-white text-xs font-bold">R</span>
                      </div>
                      <span className="text-white text-sm font-semibold">@radanovpridemainecoon</span>
                    </div>

                    {/* Title */}
                    <p className="text-white text-xs font-medium mb-1 line-clamp-1">
                      {video.title}
                    </p>

                    {/* Description */}
                    {video.description && (
                      <p className="text-white text-xs mb-2 line-clamp-2 opacity-90">
                        {video.description}
                      </p>
                    )}

                    {/* Hashtags */}
                    {video.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {video.hashtags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="text-blue-300 text-xs">
                            {tag.startsWith('#') ? tag : `#${tag}`}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Engagement Stats */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(video._id);
                          }}
                          className={`flex items-center space-x-1 transition-colors ${
                            likedVideos.has(video._id) ? 'text-red-500' : 'text-white hover:text-red-500'
                          }`}
                        >
                          <Heart className="w-4 h-4" fill={likedVideos.has(video._id) ? 'currentColor' : 'none'} />
                          <span className="text-xs">{formatCount(video.likeCount)}</span>
                        </button>
                        {video.commentCount !== undefined && (
                          <div className="flex items-center space-x-1 text-white">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-xs">{formatCount(video.commentCount)}</span>
                          </div>
                        )}
                        {video.viewCount !== undefined && (
                          <div className="flex items-center space-x-1 text-white">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                            </svg>
                            <span className="text-xs">{formatCount(video.viewCount)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        {/* CTA Section */}
        <div className="text-center">
          <a
            href="https://www.tiktok.com/@radanovpridemainecoon?is_from_webapp=1&sender_device=pc"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold text-lg rounded-full hover:from-pink-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
  {t('tiktok.followButton')}
          </a>
          <p className="text-gray-400 text-sm mt-4">
  {t('tiktok.followDescription')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default TikTokSection; 