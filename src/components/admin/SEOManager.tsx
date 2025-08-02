import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Search, Save, Globe, Eye, AlertCircle, CheckCircle } from 'lucide-react';
import { 
  useSettingsByType,
  useUpsertSetting
} from '@/services/convexSiteSettingsService';

type SEOPage = 'home' | 'gallery' | 'contact';

const SEOManager = () => {
  const seoSettings = useSettingsByType('seo');
  const upsertSetting = useUpsertSetting();
  
  const [selectedPage, setSelectedPage] = useState<SEOPage>('home');
  const [seoData, setSeoData] = useState({
    title: '',
    description: '',
    keywords: '',
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const pages = [
    { id: 'home' as SEOPage, label: 'Начална страница', path: '/' },
    { id: 'gallery' as SEOPage, label: 'Галерия', path: '/gallery' },
    { id: 'contact' as SEOPage, label: 'Контакт', path: '/contact' },
  ];

  // Load SEO settings for selected page
  useEffect(() => {
    if (seoSettings) {
      const pageSettings = seoSettings.reduce((acc, setting) => {
        if (setting.key.includes(selectedPage)) {
          const field = setting.key.replace(`${selectedPage}_`, '');
          try {
            acc[field] = JSON.parse(setting.value);
          } catch {
            acc[field] = setting.value;
          }
        }
        return acc;
      }, {} as Record<string, string>);

      setSeoData({
        title: pageSettings.seo_title || '',
        description: pageSettings.seo_description || '',
        keywords: pageSettings.seo_keywords || '',
      });
    }
  }, [seoSettings, selectedPage]);

  const calculateSEOScore = () => {
    let score = 0;
    const factors = [];

    // Title length check (30-60 characters)
    if (seoData.title.length >= 30 && seoData.title.length <= 60) {
      score += 30;
      factors.push({ text: 'Заглавие с подходяща дължина', good: true });
    } else {
      factors.push({ text: `Заглавие: ${seoData.title.length}/30-60 символа`, good: false });
    }

    // Description length check (120-160 characters)
    if (seoData.description.length >= 120 && seoData.description.length <= 160) {
      score += 30;
      factors.push({ text: 'Описание с подходяща дължина', good: true });
    } else {
      factors.push({ text: `Описание: ${seoData.description.length}/120-160 символа`, good: false });
    }

    // Keywords check (1-5 keywords)
    const keywordCount = seoData.keywords.split(',').filter(k => k.trim()).length;
    if (keywordCount >= 1 && keywordCount <= 5) {
      score += 20;
      factors.push({ text: 'Ключови думи в подходящ брой', good: true });
    } else {
      factors.push({ text: `Ключови думи: ${keywordCount}/1-5`, good: false });
    }

    // Basic content checks
    if (seoData.title.includes('рагдол') || seoData.title.includes('котка')) {
      score += 10;
      factors.push({ text: 'Заглавието съдържа основни ключови думи', good: true });
    } else {
      factors.push({ text: 'Заглавието не съдържа основни ключови думи', good: false });
    }

    if (seoData.description.includes('рагдол') || seoData.description.includes('котка')) {
      score += 10;
      factors.push({ text: 'Описанието съдържа основни ключови думи', good: true });
    } else {
      factors.push({ text: 'Описанието не съдържа основни ключови думи', good: false });
    }

    return { score, factors };
  };

  const { score, factors } = calculateSEOScore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      // Save each SEO setting for the selected page
      const promises = [
        upsertSetting({
          key: `${selectedPage}_seo_title`,
          value: JSON.stringify(seoData.title),
          type: 'seo',
          description: `SEO title for ${selectedPage} page`
        }),
        upsertSetting({
          key: `${selectedPage}_seo_description`,
          value: JSON.stringify(seoData.description),
          type: 'seo',
          description: `SEO description for ${selectedPage} page`
        }),
        upsertSetting({
          key: `${selectedPage}_seo_keywords`,
          value: JSON.stringify(seoData.keywords),
          type: 'seo',
          description: `SEO keywords for ${selectedPage} page`
        })
      ];

      await Promise.all(promises);
      
      setSaveMessage('SEO настройките са запазени успешно!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving SEO settings:', error);
      setSaveMessage('Грешка при запазването на SEO настройките');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <h2 className="font-playfair text-xl font-semibold">SEO Мениджър</h2>
        <div className="flex items-center gap-3">
          {saveMessage && (
            <span className={`text-sm ${saveMessage.includes('Грешка') ? 'text-red-600' : 'text-green-600'}`}>
              {saveMessage}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Page Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Изберете страница за редактиране
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedPage} onValueChange={(value: SEOPage) => setSelectedPage(value)}>
              <SelectTrigger className="w-full min-h-[44px]">
                <SelectValue placeholder="Изберете страница" />
              </SelectTrigger>
              <SelectContent>
                {pages.map(page => (
                  <SelectItem key={page.id} value={page.id}>
                    {page.label} ({page.path})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* SEO Score */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">SEO Оценка</span>
              <Badge variant={score >= 80 ? 'default' : score >= 60 ? 'secondary' : 'destructive'}>
                {score}/100
              </Badge>
            </div>
            <Progress value={score} className="h-2 mb-4" />
            <div className="space-y-1">
              {factors.map((factor, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  {factor.good ? 
                    <CheckCircle className="w-3 h-3 text-green-600" /> : 
                    <AlertCircle className="w-3 h-3 text-orange-600" />
                  }
                  <span className={factor.good ? 'text-green-700' : 'text-orange-700'}>
                    {factor.text}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SEO Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              SEO Метаданни за {pages.find(p => p.id === selectedPage)?.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Meta Title */}
              <div className="space-y-2">
                <Label htmlFor="seo-title">Meta Заглавие</Label>
                <Input
                  id="seo-title"
                  value={seoData.title}
                  onChange={(e) => setSeoData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Въведете SEO заглавие..."
                  className="min-h-[44px]"
                  maxLength={60}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Препоръчително: 30-60 символа</span>
                  <span className={seoData.title.length > 60 ? 'text-red-600' : 'text-green-600'}>
                    {seoData.title.length}/60
                  </span>
                </div>
              </div>

              {/* Meta Description */}
              <div className="space-y-2">
                <Label htmlFor="seo-description">Meta Описание</Label>
                <Textarea
                  id="seo-description"
                  value={seoData.description}
                  onChange={(e) => setSeoData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Въведете SEO описание..."
                  className="min-h-[100px] resize-none"
                  maxLength={160}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Препоръчително: 120-160 символа</span>
                  <span className={seoData.description.length > 160 ? 'text-red-600' : 'text-green-600'}>
                    {seoData.description.length}/160
                  </span>
                </div>
              </div>

              {/* Keywords */}
              <div className="space-y-2">
                <Label htmlFor="seo-keywords">Ключови думи</Label>
                <Input
                  id="seo-keywords"
                  value={seoData.keywords}
                  onChange={(e) => setSeoData(prev => ({ ...prev, keywords: e.target.value }))}
                  placeholder="рагдол котки, разведение, България..."
                  className="min-h-[44px]"
                />
                <p className="text-xs text-muted-foreground">
                  Разделете ключовите думи със запетая. Препоръчително: 1-5 ключови думи.
                </p>
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <Label>Преглед в Google</Label>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                    {seoData.title || 'Заглавие на страницата'}
                  </div>
                  <div className="text-green-700 text-sm">
                    myragdollpets.com{pages.find(p => p.id === selectedPage)?.path}
                  </div>
                  <div className="text-gray-600 text-sm mt-1">
                    {seoData.description || 'Описание на страницата ще се покаже тук...'}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isSaving}
                className="w-full min-h-[44px] bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Запазване...' : 'Запази SEO настройки'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SEOManager;