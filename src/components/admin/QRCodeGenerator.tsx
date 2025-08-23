import { useState, useRef, useEffect, useCallback } from 'react';
import { Download, QrCode, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import QRCodeLib from 'qrcode';

const QRCodeGenerator = () => {
  const [url, setUrl] = useState(window.location.origin);
  const [size, setSize] = useState('200');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [logo, setLogo] = useState(true);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQRCode = useCallback(async () => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const qrSize = parseInt(size);
      
      // Generate QR code
      await QRCodeLib.toCanvas(canvas, url, {
        width: qrSize,
        margin: 2,
        color: {
          dark: foregroundColor,
          light: backgroundColor,
        },
        errorCorrectionLevel: 'M'
      });

      // If logo is enabled, draw logo on top
      if (logo) {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const logoImg = new Image();
        logoImg.crossOrigin = 'anonymous';
        logoImg.onload = () => {
          const logoSize = qrSize * 0.15; // Logo should be 15% of QR code size
          const logoX = (qrSize - logoSize) / 2;
          const logoY = (qrSize - logoSize) / 2;

          // Draw white background circle for logo
          ctx.fillStyle = backgroundColor;
          ctx.beginPath();
          ctx.arc(qrSize / 2, qrSize / 2, logoSize / 2 + 8, 0, 2 * Math.PI);
          ctx.fill();

          // Draw logo
          ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
          
          // Update data URL after logo is added
          setQrCodeDataUrl(canvas.toDataURL('image/png'));
        };
        logoImg.src = '/radanov-pride-logo.png';
      } else {
        setQrCodeDataUrl(canvas.toDataURL('image/png'));
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  }, [url, size, backgroundColor, foregroundColor, logo]);

  useEffect(() => {
    generateQRCode();
  }, [url, size, backgroundColor, foregroundColor, logo, generateQRCode]);

  const downloadQRCode = () => {
    if (!qrCodeDataUrl) return;

    const link = document.createElement('a');
    link.download = `bleuroi-qr-${Date.now()}.png`;
    link.href = qrCodeDataUrl;
    link.click();
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('URL копиран в клипборда!');
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const presetUrls = [
    { label: 'Начална страница', value: window.location.origin },
    { label: 'Галерия котки', value: `${window.location.origin}/#gallery` },
    { label: 'За нас', value: `${window.location.origin}/#about` },
    { label: 'Контакт', value: `${window.location.origin}/#contact` },
  ];

  const presetSizes = [
    { label: 'Малък (150px)', value: '150' },
    { label: 'Среден (200px)', value: '200' },
    { label: 'Голям (300px)', value: '300' },
    { label: 'Много голям (400px)', value: '400' },
    { label: 'Печат (600px)', value: '600' },
  ];

  const ragdollColors = [
    { label: 'Бял', value: '#FFFFFF' },
    { label: 'Крем', value: '#FAF8F5' },
    { label: 'Светло сив', value: '#E8E6E3' },
    { label: 'Ragdoll Син', value: '#7296B8' },
    { label: 'Лавандула', value: '#D9D1E8' },
    { label: 'Черен', value: '#000000' },
    { label: 'Тъмно сив', value: '#3C3F47' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">QR Код Генератор</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <QrCode className="h-4 w-4" />
          BleuRoi Ragdoll Cattery
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Settings Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Настройки на QR кода</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* URL Settings */}
            <div className="space-y-3">
              <Label htmlFor="url">URL адрес</Label>
              <div className="flex gap-2">
                <Input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                  title="Копирай URL"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => window.open(url, '_blank')}
                  title="Отвори URL"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Бързи връзки:</Label>
                <div className="grid grid-cols-2 gap-2">
                  {presetUrls.map((preset) => (
                    <Button
                      key={preset.value}
                      variant="outline"
                      size="sm"
                      onClick={() => setUrl(preset.value)}
                      className="text-xs justify-start"
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Size Settings */}
            <div className="space-y-3">
              <Label htmlFor="size">Размер</Label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {presetSizes.map((preset) => (
                    <SelectItem key={preset.value} value={preset.value}>
                      {preset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Color Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="bg-color">Фонов цвят</Label>
                <Select value={backgroundColor} onValueChange={setBackgroundColor}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ragdollColors.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded border"
                            style={{ backgroundColor: color.value }}
                          />
                          {color.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="fg-color">Цвят на кода</Label>
                <Select value={foregroundColor} onValueChange={setForegroundColor}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ragdollColors.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded border"
                            style={{ backgroundColor: color.value }}
                          />
                          {color.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Logo Settings */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="logo">BleuRoi лого в центъра</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLogo(!logo)}
                  className={logo ? 'bg-green-50 text-green-700 border-green-200' : ''}
                >
                  {logo ? 'Включено' : 'Изключено'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Добавя логото на BleuRoi в центъра на QR кода
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Preview and Download Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Преглед и изтегляне</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* QR Code Preview */}
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-white rounded-lg shadow-inner border-2 border-dashed border-gray-200">
                <canvas
                  ref={canvasRef}
                  className="block"
                  style={{
                    imageRendering: 'pixelated',
                    maxWidth: '100%',
                    height: 'auto'
                  }}
                />
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Размер: {size}x{size}px
                </p>
                <p className="text-xs text-muted-foreground break-all max-w-[300px]">
                  {url}
                </p>
              </div>
            </div>

            {/* Download Button */}
            <div className="space-y-4">
              <Button
                onClick={downloadQRCode}
                disabled={!qrCodeDataUrl}
                className="w-full bg-ragdoll-blue hover:bg-ragdoll-blue/90"
                size="lg"
              >
                <Download className="mr-2 h-4 w-4" />
                Изтегли QR код (PNG)
              </Button>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>• QR кодът съдържа връзка към: {new URL(url).hostname}</p>
                <p>• Файлът ще бъде запазен като PNG изображение</p>
                <p>• Препоръчително е за печат да използвате размер 600px</p>
                <p>• Логото е оптимизирано за четливост на кода</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QRCodeGenerator;