import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { GlowButton, RippleButton } from '@/components/ui/animated-button';
import { X } from 'lucide-react';

interface CatCarePopupProps {
  onClose: () => void;
}

const CatCarePopup = ({ onClose }: CatCarePopupProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    // Show popup with animation
    const timer = setTimeout(() => {
      setIsVisible(true);
      // Stagger content animation
      setTimeout(() => setContentVisible(true), 200);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 transition-all duration-300 ${
        isVisible ? 'bg-black/70 dark:bg-black/80 backdrop-blur-md' : 'bg-transparent'
      }`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`relative max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-card border border-border/50 dark:border-border rounded-xl sm:rounded-2xl shadow-2xl dark:shadow-black/50 transform transition-all duration-500 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
        }`}
        style={{
          animation: isVisible ? 'scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'none'
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 bg-card rounded-full shadow-lg flex items-center justify-center hover:bg-muted transition-colors z-10 group touch-manipulation"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>

        {/* Content */}
        <div className="p-4 sm:p-6 lg:p-8 xl:p-12">
          {/* Header with Cat Paw Icons */}
          <div 
            className={`text-center mb-8 transition-all duration-700 ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <div className="flex justify-center items-center mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-2 sm:mx-3 shadow-lg">
                <span className="text-white text-lg sm:text-xl">🐾</span>
              </div>
              <h2 className="font-playfair text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-light text-foreground text-center px-2">
                Важна информация
              </h2>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-2 sm:mx-3 shadow-lg">
                <span className="text-white text-lg sm:text-xl">💙</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wide text-center">
              За грижата към Рагдол котките
            </p>
          </div>

          {/* Main Content */}
          <div 
            className={`space-y-6 transition-all duration-700 delay-200 ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <div className="bg-muted/50 dark:bg-muted/30 rounded-xl p-4 sm:p-6 shadow-lg border-l-4 border-gradient-to-b from-blue-500 to-purple-500" style={{borderLeftColor: '#8b5cf6'}}>
              <h3 className="font-semibold text-base sm:text-lg text-foreground mb-3">
                🐱 Рагдол котките - нежни гиганти с големи сърца
              </h3>
              <p className="text-foreground leading-relaxed mb-4">
                Рагдол котките са прекрасни и нежни спътници, но изискват сериозна отговорност. 
                Преди да вземете решение, моля обмислете следното:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="w-2 h-2 bg-foreground rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    <strong>Финансови разходи:</strong> Храна, ветеринарни грижи, принадлежности - над 1000 лв. годишно
                  </p>
                </div>
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="w-2 h-2 bg-foreground rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    <strong>Време и внимание:</strong> Ежедневно четкане (дълга козина), игра и много обич
                  </p>
                </div>
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="w-2 h-2 bg-foreground rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    <strong>Дългосрочен ангажимент:</strong> Рагдол котките живеят 13-18 години
                  </p>
                </div>
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="w-2 h-2 bg-foreground rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    <strong>Простор и условия:</strong> Спокойна среда - Рагдолите са нежни и чувствителни
                  </p>
                </div>
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="w-2 h-2 bg-foreground rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    <strong>Специални потребности:</strong> Не излизат навън - само вътрешни котки за безопасност
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-xl p-4 sm:p-6 border border-blue-200 dark:border-blue-800 shadow-inner">
              <p className="text-center text-foreground font-medium mb-4 text-sm sm:text-base">
                💝 Котката не е подарък или импулсивно решение
              </p>
              <p className="text-center text-xs sm:text-sm text-muted-foreground">
                Ако сте готови за отговорния ангажимент, ние ще бъдем щастливи да ви помогнем 
                да намерите перфектния спътник за вашето семейство.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div 
            className={`flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 transition-all duration-700 delay-400 ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <GlowButton 
              onClick={handleClose}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 h-11 sm:h-10 text-sm sm:text-base touch-manipulation shadow-lg"
              glowColor="#8b5cf6"
            >
              Разбирам отговорността ❤️
            </GlowButton>
            <RippleButton 
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 h-11 sm:h-10 text-sm sm:text-base touch-manipulation"
            >
              Искам повече информация 💭
            </RippleButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatCarePopup;