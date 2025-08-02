import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Trash2, Edit, Eye, EyeOff, Plus, ExternalLink } from 'lucide-react';
import { 
  useAllTikTokVideos, 
  useCreateTikTokVideo, 
  useUpdateTikTokVideo, 
  useDeleteTikTokVideo, 
  useToggleTikTokVideoActive,
  TikTokVideoData,
  TikTokVideoFormData
} from '@/services/convexTikTokService';
import { useCats, CatData } from '@/services/convexCatService';
import { Id } from '../../../convex/_generated/dataModel';

const TikTokVideoManager = () => {
  const videos = useAllTikTokVideos();
  const cats = useCats();
  const createVideo = useCreateTikTokVideo();
  const updateVideo = useUpdateTikTokVideo();
  const deleteVideo = useDeleteTikTokVideo();
  const toggleVideoActive = useToggleTikTokVideoActive();

  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [editingVideo, setEditingVideo] = useState<TikTokVideoData | null>(null);
  const [formData, setFormData] = useState<TikTokVideoFormData>({
    catId: undefined,
    videoUrl: '',
    embedId: '',
    thumbnail: '',
    title: '',
    description: '',
    hashtags: [],
    viewCount: undefined,
    likeCount: undefined,
    commentCount: undefined,
    shareCount: undefined,
    isActive: true,
  });

  const resetForm = () => {
    setFormData({
      catId: undefined,
      videoUrl: '',
      embedId: '',
      thumbnail: '',
      title: '',
      description: '',
      hashtags: [],
      viewCount: undefined,
      likeCount: undefined,
      commentCount: undefined,
      shareCount: undefined,
      isActive: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingVideo) {
        await updateVideo({
          id: editingVideo._id,
          ...formData,
        });
        setEditingVideo(null);
      } else {
        await createVideo(formData);
        setIsAddingVideo(false);
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving TikTok video:', error);
      alert('Грешка при запазването на видеото');
    }
  };

  const handleEdit = (video: TikTokVideoData) => {
    setEditingVideo(video);
    setFormData({
      catId: video.catId,
      videoUrl: video.videoUrl,
      embedId: video.embedId || '',
      thumbnail: video.thumbnail,
      title: video.title,
      description: video.description || '',
      hashtags: video.hashtags,
      viewCount: video.viewCount,
      likeCount: video.likeCount,
      commentCount: video.commentCount,
      shareCount: video.shareCount,
      isActive: video.isActive,
    });
  };

  const handleDelete = async (id: Id<"tiktokVideos">) => {
    if (confirm('Сигурни ли сте, че искате да изтриете това видео?')) {
      try {
        await deleteVideo({ id });
      } catch (error) {
        console.error('Error deleting video:', error);
        alert('Грешка при изтриването на видеото');
      }
    }
  };

  const handleToggleActive = async (id: Id<"tiktokVideos">) => {
    try {
      await toggleVideoActive({ id });
    } catch (error) {
      console.error('Error toggling video active:', error);
      alert('Грешка при промяната на статуса');
    }
  };

  const handleHashtagsChange = (value: string) => {
    const hashtags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData(prev => ({ ...prev, hashtags }));
  };

  const getCatName = (catId?: Id<"cats">) => {
    if (!catId) return 'Глобално видео';
    const cat = cats?.find(c => c._id === catId);
    return cat?.name || 'Неизвестна котка';
  };

  const showForm = isAddingVideo || editingVideo;

  if (showForm) {
    return (
      <div className="h-full flex flex-col">
        {/* Form Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <h2 className="font-playfair text-xl font-semibold">
            {editingVideo ? 'Редактиране на TikTok видео' : 'Добавяне на ново TikTok видео'}
          </h2>
          <Button
            onClick={() => {
              setIsAddingVideo(false);
              setEditingVideo(null);
              resetForm();
            }}
            variant="outline"
            className="min-h-[44px]"
          >
            ← Назад
          </Button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Заглавие *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Заглавие на видеото"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="catId">Котка</Label>
                    <Select 
                      value={formData.catId || 'global'} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, catId: value === 'global' ? undefined : value as Id<"cats"> }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="global">Глобално видео</SelectItem>
                        {cats?.map(cat => (
                          <SelectItem key={cat._id} value={cat._id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="videoUrl">TikTok URL *</Label>
                  <Input
                    id="videoUrl"
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                    placeholder="https://www.tiktok.com/@username/video/..."
                    required
                  />
                </div>

                <ImageUpload
                  label="Thumbnail изображение *"
                  placeholder="Изберете thumbnail изображение"
                  required
                  currentImageUrl={formData.thumbnail}
                  onUploadSuccess={(url, storageId) => {
                    setFormData(prev => ({ ...prev, thumbnail: url }));
                  }}
                  onUploadError={(error) => {
                    console.error('Thumbnail upload error:', error);
                  }}
                  uploadOptions={{
                    imageType: 'general'
                  }}
                  previewSize="medium"
                />

                <div className="space-y-2">
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Описание на видеото..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hashtags">Хаштагове (разделени със запетая)</Label>
                  <Input
                    id="hashtags"
                    value={formData.hashtags.join(', ')}
                    onChange={(e) => handleHashtagsChange(e.target.value)}
                    placeholder="#котки, #ragdoll, #радановпрайд"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="viewCount">Брой гледания</Label>
                    <Input
                      id="viewCount"
                      type="number"
                      value={formData.viewCount || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, viewCount: e.target.value ? parseInt(e.target.value) : undefined }))}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="likeCount">Брой харесвания</Label>
                    <Input
                      id="likeCount"
                      type="number"
                      value={formData.likeCount || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, likeCount: e.target.value ? parseInt(e.target.value) : undefined }))}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="isActive">Активно видео</Label>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                  <Button type="submit" className="bg-black text-white hover:bg-gray-800 min-h-[44px] w-full sm:w-auto">
                    {editingVideo ? 'Запази' : 'Добави'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="min-h-[44px] w-full sm:w-auto"
                    onClick={() => {
                      setIsAddingVideo(false);
                      setEditingVideo(null);
                      resetForm();
                    }}
                  >
                    Отказ
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <h2 className="font-playfair text-xl font-semibold">TikTok видеа</h2>
        <Button
          onClick={() => setIsAddingVideo(true)}
          className="bg-black text-white hover:bg-gray-800 min-h-[44px]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добави видео
        </Button>
      </div>

      {/* Video Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos?.map((video) => (
            <Card key={video._id} className="overflow-hidden">
              <CardHeader className="p-0">
                <div className="relative aspect-video">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge variant={video.isActive ? "default" : "secondary"}>
                      {video.isActive ? "Активно" : "Неактивно"}
                    </Badge>
                  </div>
                  {video.catId && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="outline" className="bg-white/90">
                        {getCatName(video.catId)}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 line-clamp-2">{video.title}</h3>
                {video.description && (
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {video.description}
                  </p>
                )}
                
                {video.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {video.hashtags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {video.hashtags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{video.hashtags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <div className="flex gap-4">
                    {video.viewCount && <span>👁️ {video.viewCount.toLocaleString()}</span>}
                    {video.likeCount && <span>❤️ {video.likeCount.toLocaleString()}</span>}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(video.videoUrl, '_blank')}
                    className="flex-1 min-h-[44px] sm:min-h-[36px]"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Виж
                  </Button>
                  <div className="flex gap-2 sm:gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleActive(video._id)}
                      className="flex-1 sm:flex-none min-h-[44px] sm:min-h-[36px] min-w-[44px]"
                    >
                      {video.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(video)}
                      className="flex-1 sm:flex-none min-h-[44px] sm:min-h-[36px] min-w-[44px]"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(video._id)}
                      className="text-destructive hover:text-destructive flex-1 sm:flex-none min-h-[44px] sm:min-h-[36px] min-w-[44px]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {videos && videos.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">📹 Няма TikTok видеа</p>
            <p className="text-sm">Добавете първото видео</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TikTokVideoManager;