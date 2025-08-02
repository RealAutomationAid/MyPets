import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { GlowButton, RippleButton, BounceButton } from '@/components/ui/animated-button';
import { Plus, Edit, Trash2, Save, Eye, Calendar, FileText } from 'lucide-react';
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

type Announcement = {
  _id: Id<"announcements">;
  _creationTime: number;
  title: string;
  content: string;
  featuredImage?: string;
  isPublished: boolean;
  publishedAt: number;
  sortOrder: number;
  updatedAt: number;
};

const NewsManager = () => {
  const announcements = useQuery(api.announcements.getAllAnnouncements);
  const createAnnouncement = useMutation(api.announcements.createAnnouncement);
  const updateAnnouncement = useMutation(api.announcements.updateAnnouncement);
  const deleteAnnouncement = useMutation(api.announcements.deleteAnnouncement);
  const togglePublication = useMutation(api.announcements.toggleAnnouncementPublication);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    featuredImage: '',
    featuredImageStorageId: '',
    isPublished: false,
    sortOrder: 0,
  });
  const [isSaving, setIsSaving] = useState(false);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isDialogOpen) {
      setEditingAnnouncement(null);
      setFormData({
        title: '',
        content: '',
        featuredImage: '',
        featuredImageStorageId: '',
        isPublished: false,
        sortOrder: 0,
      });
    }
  }, [isDialogOpen]);

  // Load data when editing
  useEffect(() => {
    if (editingAnnouncement) {
      setFormData({
        title: editingAnnouncement.title,
        content: editingAnnouncement.content,
        featuredImage: editingAnnouncement.featuredImage || '',
        featuredImageStorageId: '',
        isPublished: editingAnnouncement.isPublished,
        sortOrder: editingAnnouncement.sortOrder,
      });
      setIsDialogOpen(true);
    }
  }, [editingAnnouncement]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (editingAnnouncement) {
        await updateAnnouncement({
          id: editingAnnouncement._id,
          title: formData.title,
          content: formData.content,
          featuredImage: formData.featuredImage,
          isPublished: formData.isPublished,
          sortOrder: formData.sortOrder,
        });
      } else {
        const nextSortOrder = announcements ? announcements.length + 1 : 1;
        await createAnnouncement({
          title: formData.title,
          content: formData.content,
          featuredImage: formData.featuredImage,
          isPublished: formData.isPublished,
          sortOrder: nextSortOrder,
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving announcement:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: Id<"announcements">) => {
    if (confirm('Сигурни ли сте, че искате да изтриете тази новина?')) {
      try {
        await deleteAnnouncement({ id });
      } catch (error) {
        console.error('Error deleting announcement:', error);
      }
    }
  };

  const handleTogglePublication = async (id: Id<"announcements">) => {
    try {
      await togglePublication({ id });
    } catch (error) {
      console.error('Error toggling publication:', error);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('bg-BG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <h2 className="font-playfair text-xl font-semibold">Новини и Съобщения</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="min-h-[44px] flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Нова новина
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAnnouncement ? 'Редактиране на новина' : 'Създаване на нова новина'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Заглавие *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Въведете заглавие на новината..."
                  className="min-h-[44px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Съдържание *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Въведете съдържанието на новината..."
                  className="min-h-[150px] resize-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <ImageUpload
                  label="Основна снимка"
                  currentImageUrl={formData.featuredImage}
                  onUploadSuccess={(url, storageId) => {
                    setFormData(prev => ({ 
                      ...prev, 
                      featuredImage: url,
                      featuredImageStorageId: storageId
                    }));
                  }}
                  onUploadError={(error) => {
                    console.error('Upload error:', error);
                  }}
                  uploadOptions={{
                    imageType: 'news',
                    maxSizeInMB: 5,
                    quality: 0.8
                  }}
                  previewSize="medium"
                />
                <p className="text-xs text-muted-foreground">
                  Качете снимка за новината (JPG, PNG, GIF или WebP, макс. 5MB)
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublished: checked }))}
                />
                <Label htmlFor="published">Публикувай веднага</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="flex-1 min-h-[44px] flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Запазване...' : 'Запази'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1 min-h-[44px]"
                >
                  Отказ
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {announcements === undefined ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Зареждане на новини...</p>
            </div>
          </div>
        ) : announcements.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Няма публикувани новини</h3>
              <p className="text-gray-500 mb-4">Създайте първата си новина, за да започнете.</p>
              <Button onClick={() => setIsDialogOpen(true)} className="min-h-[44px]">
                <Plus className="h-4 w-4 mr-2" />
                Създай първа новина
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {announcements
              .sort((a, b) => b.updatedAt - a.updatedAt)
              .map((announcement) => (
                <Card key={announcement._id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{announcement.title}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {announcement.isPublished 
                              ? `Публикувано: ${formatDate(announcement.publishedAt)}`
                              : `Създадено: ${formatDate(announcement._creationTime)}`
                            }
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={announcement.isPublished ? 'default' : 'secondary'}>
                          {announcement.isPublished ? 'Публикувано' : 'Чернова'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {announcement.content}
                    </p>
                    {announcement.featuredImage && (
                      <div className="mb-4">
                        <img 
                          src={announcement.featuredImage} 
                          alt={announcement.title}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingAnnouncement(announcement)}
                        className="min-h-[40px] flex items-center gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        Редактирай
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTogglePublication(announcement._id)}
                        className="min-h-[40px] flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        {announcement.isPublished ? 'Скрий' : 'Публикувай'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(announcement._id)}
                        className="min-h-[40px] flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Изтрий
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsManager;