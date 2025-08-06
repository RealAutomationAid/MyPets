import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { GlowButton, RippleButton, BounceButton } from '@/components/ui/animated-button';
import { Plus, Edit, Trash2, Save, Eye, Trophy, Calendar, Building2, X, ImagePlus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  useAllAwards,
  useCreateAward,
  useUpdateAward,
  useDeleteAward,
  useToggleAwardPublication,
  AwardData,
  AwardCategory,
  formatAwardDate,
  getCategoryLabel,
  getCategoryColor
} from '@/services/convexAwardService';
import { useCats } from '@/services/convexCatService';

const AwardsManager = () => {
  const awards = useAllAwards();
  const cats = useCats();
  const createAward = useCreateAward();
  const updateAward = useUpdateAward();
  const deleteAward = useDeleteAward();
  const togglePublication = useToggleAwardPublication();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAward, setEditingAward] = useState<AwardData | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    awardDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    awardingOrganization: '',
    category: 'other' as AwardCategory,
    certificateImage: '',
    certificateImageStorageId: '',
    galleryImages: [] as string[],
    galleryImageStorageIds: [] as string[],
    associatedCatId: '',
    achievements: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isDialogOpen) {
      setFormData({
        title: '',
        description: '',
        awardDate: new Date().toISOString().split('T')[0],
        awardingOrganization: '',
        category: 'other',
        certificateImage: '',
        certificateImageStorageId: '',
        galleryImages: [],
        galleryImageStorageIds: [],
        associatedCatId: '',
        achievements: '',
      });
      setEditingAward(null);
    }
  }, [isDialogOpen]);

  // Populate form when editing
  useEffect(() => {
    if (editingAward) {
      setFormData({
        title: editingAward.title,
        description: editingAward.description,
        awardDate: new Date(editingAward.awardDate).toISOString().split('T')[0],
        awardingOrganization: editingAward.awardingOrganization,
        category: editingAward.category,
        certificateImage: editingAward.certificateImage,
        certificateImageStorageId: '',
        galleryImages: editingAward.galleryImages,
        galleryImageStorageIds: [],
        associatedCatId: editingAward.associatedCatId || '',
        achievements: editingAward.achievements || '',
      });
    }
  }, [editingAward]);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCertificateUpload = (url: string, storageId: string) => {
    setFormData(prev => ({
      ...prev,
      certificateImage: url,
      certificateImageStorageId: storageId
    }));
  };

  const handleGalleryUpload = (url: string, storageId: string) => {
    setFormData(prev => ({
      ...prev,
      galleryImages: [...prev.galleryImages, url],
      galleryImageStorageIds: [...prev.galleryImageStorageIds, storageId]
    }));
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
      galleryImageStorageIds: prev.galleryImageStorageIds.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.certificateImage) {
      toast({
        title: "Грешка",
        description: "Моля попълнете всички задължителни полета и качете сертификат.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const awardDate = new Date(formData.awardDate).getTime();
      
      const awardData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        awardDate,
        awardingOrganization: formData.awardingOrganization.trim(),
        category: formData.category,
        certificateImage: formData.certificateImage,
        galleryImages: formData.galleryImages,
        associatedCatId: formData.associatedCatId ? formData.associatedCatId as any : undefined,
        achievements: formData.achievements.trim() || undefined,
      };

      if (editingAward) {
        await updateAward({
          id: editingAward._id,
          ...awardData,
        });
        toast({
          title: "Успех",
          description: "Наградата е обновена успешно.",
        });
      } else {
        await createAward(awardData);
        toast({
          title: "Успех", 
          description: "Наградата е създадена успешно.",
        });
      }

      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving award:', error);
      toast({
        title: "Грешка",
        description: "Възникна грешка при запазване на наградата.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (award: AwardData) => {
    setEditingAward(award);
    setIsDialogOpen(true);
  };

  const handleDelete = async (awardId: string) => {
    if (!confirm('Сигурни ли сте, че искате да изтриете тази награда?')) {
      return;
    }

    try {
      await deleteAward({ id: awardId as any });
      toast({
        title: "Успех",
        description: "Наградата е изтрита успешно.",
      });
    } catch (error) {
      console.error('Error deleting award:', error);
      toast({
        title: "Грешка",
        description: "Възникна грешка при изтриване.",
        variant: "destructive",
      });
    }
  };

  const handleTogglePublication = async (awardId: string) => {
    try {
      await togglePublication({ id: awardId as any });
      toast({
        title: "Успех",
        description: "Статусът на публикация е променен.",
      });
    } catch (error) {
      console.error('Error toggling publication:', error);
      toast({
        title: "Грешка",
        description: "Възникна грешка при промяна на статуса.",
        variant: "destructive",
      });
    }
  };

  const sortedAwards = awards?.sort((a, b) => b.awardDate - a.awardDate) || [];

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
            <Trophy className="h-7 w-7 text-primary" />
            Управление на награди
          </h1>
          <p className="text-muted-foreground mt-1">
            Добавяне и редактиране на награди и признания за развъдника
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <GlowButton size="default" className="min-h-[44px] touch-manipulation">
              <Plus className="h-4 w-4 mr-2" />
              Нова награда
            </GlowButton>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAward ? 'Редактиране на награда' : 'Нова награда'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <Label htmlFor="title">Заглавие *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Например: Best in Show - TICA Championship"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Описание *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Подробно описание на наградата..."
                  rows={3}
                  required
                />
              </div>

              {/* Award Date and Organization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="awardDate">Дата на наградата *</Label>
                  <Input
                    id="awardDate"
                    type="date"
                    value={formData.awardDate}
                    onChange={(e) => handleInputChange('awardDate', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="organization">Организация *</Label>
                  <Input
                    id="organization"
                    value={formData.awardingOrganization}
                    onChange={(e) => handleInputChange('awardingOrganization', e.target.value)}
                    placeholder="TICA, CFA, WCF..."
                    required
                  />
                </div>
              </div>

              {/* Category and Associated Cat */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Категория *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: AwardCategory) => handleInputChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="best_in_show">Най-добър от изложбата</SelectItem>
                      <SelectItem value="championship">Шампионат</SelectItem>
                      <SelectItem value="cattery_recognition">Признание за развъдник</SelectItem>
                      <SelectItem value="breeding_award">Награда за развъждане</SelectItem>
                      <SelectItem value="other">Други</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="associatedCat">Свързана котка (опционално)</Label>
                  <Select
                    value={formData.associatedCatId}
                    onValueChange={(value) => handleInputChange('associatedCatId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Изберете котка..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Няма</SelectItem>
                      {cats?.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Certificate Image */}
              <div>
                <Label>Сертификат / Основна снимка *</Label>
                <ImageUpload
                  onUploadSuccess={handleCertificateUpload}
                  currentImageUrl={formData.certificateImage}
                  label="Сертификат"
                  placeholder="Качете снимка на сертификата"
                  required
                  uploadOptions={{ imageType: "award_certificate" }}
                  previewSize="large"
                />
              </div>

              {/* Gallery Images */}
              <div>
                <Label>Галерия със снимки (опционално)</Label>
                <div className="space-y-2">
                  {formData.galleryImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {formData.galleryImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Галерия ${index + 1}`}
                            className="w-full aspect-square object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeGalleryImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <ImageUpload
                    onUploadSuccess={handleGalleryUpload}
                    label="Добави снимка към галерията"
                    placeholder="Качете допълнителни снимки"
                    uploadOptions={{ imageType: "award_gallery" }}
                    className="border-dashed"
                  />
                </div>
              </div>

              {/* Additional Achievements */}
              <div>
                <Label htmlFor="achievements">Допълнителни постижения (опционално)</Label>
                <Textarea
                  id="achievements"
                  value={formData.achievements}
                  onChange={(e) => handleInputChange('achievements', e.target.value)}
                  placeholder="Други постижения, статистики или интересни факти..."
                  rows={2}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSaving}
                >
                  Отказ
                </Button>
                <RippleButton
                  type="submit"
                  disabled={isSaving}
                  className="min-w-[100px]"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Запазване...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {editingAward ? 'Обнови' : 'Създай'}
                    </>
                  )}
                </RippleButton>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Awards List */}
      <div className="grid gap-4">
        {sortedAwards.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Все още няма награди.</p>
            </CardContent>
          </Card>
        ) : (
          sortedAwards.map((award) => (
            <Card key={award._id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        variant="secondary" 
                        className={`${getCategoryColor(award.category)} font-medium`}
                      >
                        {getCategoryLabel(award.category)}
                      </Badge>
                      {award.isPublished ? (
                        <Badge variant="default" className="bg-green-500">
                          <Eye className="h-3 w-3 mr-1" />
                          Публикувана
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Чернова</Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{award.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatAwardDate(award.awardDate)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {award.awardingOrganization}
                      </div>
                      {award.galleryImages.length > 0 && (
                        <div className="flex items-center gap-1">
                          <ImagePlus className="h-4 w-4" />
                          +{award.galleryImages.length} снимки
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <img
                      src={award.certificateImage}
                      alt={award.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                  {award.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(award)}
                    className="touch-manipulation"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Редактирай
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTogglePublication(award._id)}
                    className="touch-manipulation"
                  >
                    {award.isPublished ? 'Скрий' : 'Публикувай'}
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(award._id)}
                    className="touch-manipulation"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Изтрий
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AwardsManager;