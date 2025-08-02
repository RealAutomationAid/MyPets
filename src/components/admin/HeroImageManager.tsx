import { useState, useRef } from 'react';
import { Upload, Trash2, Eye, EyeOff, Camera, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useFileUpload, validateImageFile } from '@/services/convexFileService';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

const HeroImageManager = () => {
  const { uploadFile } = useFileUpload();
  const { toast } = useToast();
  
  // Convex queries and mutations
  const heroImages = useQuery(api.heroImages.getHeroImages) || [];
  const addHeroImage = useMutation(api.heroImages.addHeroImage);
  const updateHeroImage = useMutation(api.heroImages.updateHeroImage);
  const deleteHeroImage = useMutation(api.heroImages.deleteHeroImage);
  const toggleImageActive = useMutation(api.heroImages.toggleHeroImageActive);
  const moveImage = useMutation(api.heroImages.moveHeroImage);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFileName, setCurrentFileName] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await handleFileInput(file);
    
    // Reset file input for potential re-uploads
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleFileInput = async (file: File) => {
    if (!file) return;

    // Validate file before upload
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast({
        title: "Грешка при качване",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setCurrentFileName(file.name);
    
    try {
      // Show uploading toast
      toast({
        title: "Качване на изображение",
        description: `Започване качването на ${file.name}...`,
      });

      const result = await uploadFile(file, { 
        imageType: 'general',
        onProgress: (progress) => {
          setUploadProgress(progress);
        }
      });
      
      if (result.success && result.url) {
        // Add new image to the database
        await addHeroImage({
          src: result.url,
          alt: `Hero Image ${heroImages.length + 1}`,
          isActive: false,
        });
        
        toast({
          title: "Успешно качване",
          description: "Изображението беше добавено успешно!",
        });
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      toast({
        title: "Грешка при качване",
        description: error instanceof Error ? error.message : "Възникна грешка при качването на изображението",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setCurrentFileName('');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileInput(imageFile);
    } else {
      toast({
        title: "Грешка",
        description: "Моля, пуснете валиден файл с изображение",
        variant: "destructive",
      });
    }
  };

  const handleUploadButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleToggleImageActive = async (id: Id<"heroImages">) => {
    try {
      await toggleImageActive({ id });
      toast({
        title: "Успешна промяна",
        description: "Статусът на изображението беше променен!",
      });
    } catch (error) {
      console.error('Failed to toggle image active:', error);
      toast({
        title: "Грешка",
        description: error instanceof Error ? error.message : "Възникна грешка при промяната на статуса",
        variant: "destructive",
      });
    }
  };

  const handleRemoveImage = async (id: Id<"heroImages">) => {
    try {
      await deleteHeroImage({ id });
      toast({
        title: "Успешно изтриване",
        description: "Изображението беше изтрито!",
      });
    } catch (error) {
      console.error('Failed to delete image:', error);
      toast({
        title: "Грешка при изтриване",
        description: "Възникна грешка при изтриването на изображението",
        variant: "destructive",
      });
    }
  };

  const handleUpdateAltText = async (id: Id<"heroImages">, newAlt: string) => {
    try {
      await updateHeroImage({ id, alt: newAlt });
    } catch (error) {
      console.error('Failed to update alt text:', error);
      toast({
        title: "Грешка при обновяване",
        description: "Възникна грешка при обновяването на alt текста",
        variant: "destructive",
      });
    }
  };

  const handleMoveImage = async (id: Id<"heroImages">, direction: 'up' | 'down') => {
    try {
      await moveImage({ id, direction });
      toast({
        title: "Успешна промяна",
        description: "Позицията на изображението беше променена!",
      });
    } catch (error) {
      console.error('Failed to move image:', error);
      toast({
        title: "Грешка при преместване",
        description: "Възникна грешка при преместването на изображението",
        variant: "destructive",
      });
    }
  };

  const activeImages = heroImages.filter(img => img.isActive);
  const inactiveImages = heroImages.filter(img => !img.isActive);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление на Hero Изображения</h2>
        
        {/* Main Upload Button */}
        <div className="flex flex-col items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading}
            capture="environment"
          />
          <Button 
            size="lg"
            disabled={isUploading}
            onClick={handleUploadButtonClick}
            className="bg-ragdoll-blue hover:bg-ragdoll-blue/90 text-white px-8 py-4 text-lg flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Upload className="h-6 w-6" />
            {isUploading ? 'Качване...' : 'Качи Изображение'}
          </Button>

          {/* Upload Progress */}
          {isUploading && (
            <div className="w-full max-w-md space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="truncate text-muted-foreground">
                  {currentFileName}
                </span>
                <span className="text-muted-foreground">
                  {uploadProgress}%
                </span>
              </div>
              <Progress value={uploadProgress} className="h-3" />
            </div>
          )}
        </div>
      </div>

      {/* Optional: Drag and Drop Upload Area (smaller, secondary) */}
      <div
        className={`border border-dashed rounded-lg p-4 text-center transition-colors ${
          isDragOver 
            ? 'border-ragdoll-blue bg-ragdoll-blue/5' 
            : 'border-gray-200 hover:border-ragdoll-blue/30'
        } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex items-center justify-center gap-2">
          <Upload className="w-4 h-4 text-gray-400" />
          <p className="text-sm text-gray-500">
            {isDragOver ? 'Пуснете тук' : 'или плъзнете и пуснете изображение'}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Active Images */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-green-600 flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Активни Изображения ({activeImages.length}/6)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeImages.map((image, index) => (
                <div key={image._id} className="flex items-center gap-4 p-3 border rounded-lg">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-16 h-16 object-cover rounded-full"
                  />
                  
                  <div className="flex-1">
                    <input
                      type="text"
                      value={image.alt}
                      onChange={(e) => handleUpdateAltText(image._id, e.target.value)}
                      className="w-full p-1 text-sm border rounded"
                      placeholder="Alt текст"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      Позиция: {image.position}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveImage(image._id, 'up')}
                      disabled={index === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveImage(image._id, 'down')}
                      disabled={index === activeImages.length - 1}
                    >
                      ↓
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleImageActive(image._id)}
                      className="text-orange-600 hover:text-orange-700"
                    >
                      <EyeOff className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveImage(image._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {activeImages.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Няма активни изображения
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Inactive Images */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-orange-600 flex items-center gap-2">
              <EyeOff className="h-5 w-5" />
              Неактивни Изображения ({inactiveImages.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inactiveImages.map((image) => (
                <div key={image._id} className="flex items-center gap-4 p-3 border rounded-lg opacity-60">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-16 h-16 object-cover rounded-full"
                  />
                  
                  <div className="flex-1">
                    <input
                      type="text"
                      value={image.alt}
                      onChange={(e) => handleUpdateAltText(image._id, e.target.value)}
                      className="w-full p-1 text-sm border rounded"
                      placeholder="Alt текст"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleImageActive(image._id)}
                      className="text-green-600 hover:text-green-700"
                      disabled={activeImages.length >= 6}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveImage(image._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {inactiveImages.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Няма неактивни изображения
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Инструкции</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2 text-muted-foreground">
            <p>• Можете да активирате до 6 изображения едновременно за hero секцията</p>
            <p>• Използвайте ↑↓ бутоните за пренареждане на активните изображения</p>
            <p>• Изображенията се показват като плаващи кръгове в hero секцията</p>
            <p>• Alt текстът се използва за описание при hover и достъпност</p>
            <p>• Препоръчителен размер: квадратни изображения (1:1 пропорция)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeroImageManager;