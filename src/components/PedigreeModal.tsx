import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CatData, useParents } from '@/services/convexCatService';
import { useLanguage } from '@/hooks/useLanguage';
import { useCatURL } from '@/hooks/useCatURL';
import { Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface PedigreeModalProps {
  cat: CatData;
  isOpen: boolean;
  onClose: () => void;
}

const PedigreeModal = ({ cat, isOpen, onClose }: PedigreeModalProps) => {
  const { t } = useLanguage();
  const { generateCatURL, copyToClipboard } = useCatURL();
  const [parentModalOpen, setParentModalOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<CatData | null>(null);
  
  const parents = useParents(cat?._id);

  const openParentModal = (parent: CatData) => {
    setSelectedParent(parent);
    setParentModalOpen(true);
  };

  const closeParentModal = () => {
    setParentModalOpen(false);
    setSelectedParent(null);
  };

  if (!isOpen) return null;

  // Handle loading state
  const isLoadingParents = parents === undefined;
  const mother = parents?.mother || null;
  const father = parents?.father || null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border">
          <div>
            <h2 className="font-playfair text-2xl font-semibold text-foreground">
              {t('pedigree.title')}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {t('pedigree.familyTree')} {cat.name}
            </p>
          </div>
          <Button
            onClick={onClose}
            variant="outline"
            className="rounded-full w-10 h-10 p-0 border-foreground text-foreground hover:bg-foreground hover:text-background"
          >
            ×
          </Button>
        </div>

        {/* Pedigree Tree */}
        <div className="p-8">
          <div className="flex flex-col items-center space-y-8">
            {/* Header Info */}
            <div className="text-center mb-4">
              <h3 className="font-playfair text-xl text-white mb-2">
                {cat.name}
              </h3>
              <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg px-4 py-2 border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-medium">
                  <span className="text-muted-foreground">Връзка: </span>
                  <a 
                    href={generateCatURL(cat._id, 'pedigree')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors font-medium underline underline-offset-2"
                  >
                    ragdollbleuroi.eu/родословие/{cat.name}
                  </a>
                </p>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={async () => {
                      const success = await copyToClipboard(cat._id, 'pedigree');
                      if (success) {
                        toast.success('Връзката е копирана!');
                      } else {
                        toast.error('Неуспешно копиране на връзката');
                      }
                    }}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => {
                      window.open(generateCatURL(cat._id, 'pedigree'), '_blank', 'noopener,noreferrer');
                    }}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Cat Card */}
            <div className="bg-card rounded-xl shadow-lg p-6 w-80 text-center">
              <div className="w-full h-48 bg-muted rounded-lg overflow-hidden mb-4">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-lg text-white mb-2">
                {cat.name}
              </h3>
              <p className="text-muted-foreground text-sm mb-1">
                {cat.subtitle}
              </p>
              <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground">
                <span>{cat.gender === 'male' ? '♂' : '♀'}</span>
                <span>•</span>
                <span>{cat.age}</span>
                <span>•</span>
                <span>{cat.color}</span>
              </div>
            </div>

            {/* Loading State */}
            {isLoadingParents && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">{t('pedigree.loading')}</p>
              </div>
            )}

            {/* Connection Lines */}
            {!isLoadingParents && (mother || father) && (
              <div className="relative flex flex-col items-center">
                {/* Vertical line down */}
                <div className="w-px h-8 bg-border"></div>
                {/* Horizontal line */}
                <div className="w-64 h-px bg-border"></div>
                {/* Two vertical lines up to parents */}
                <div className="relative w-64 h-8">
                  <div className="absolute left-16 top-0 w-px h-8 bg-border"></div>
                  <div className="absolute right-16 top-0 w-px h-8 bg-border"></div>
                </div>
              </div>
            )}

            {/* Parents Section */}
            {!isLoadingParents && (mother || father) && (
              <div className="flex justify-center items-start gap-16">
                {/* Mother */}
                <div className="flex flex-col items-center">
                  {mother ? (
                    <div className="bg-card rounded-xl shadow-lg p-4 w-64 text-center cursor-pointer hover:shadow-xl transition-shadow"
                         onClick={() => openParentModal(mother)}>
                      <div className="w-full h-32 bg-muted rounded-xl overflow-hidden mb-3">
                        <img
                          src={mother.image}
                          alt={mother.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="font-semibold text-white mb-1">
                        {mother.name}
                      </h4>
                      <p className="text-muted-foreground text-sm mb-2">
                        {mother.subtitle}
                      </p>
                      <div className="flex justify-center items-center gap-1 text-xs text-muted-foreground mb-2">
                        <span>♀</span>
                        <span>•</span>
                        <span>{mother.age}</span>
                      </div>
                      <div className="text-xs text-primary hover:text-primary/80">
      {t('pedigree.clickInfo')}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-muted rounded-xl border-2 border-dashed border-border p-4 w-64 h-40 flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <p className="font-medium mb-1">{t('pedigree.mother')}</p>
                        <p className="text-sm">{t('pedigree.noData')}</p>
                      </div>
                    </div>
                  )}
                  <div className="mt-2 text-sm font-medium text-pink-600 dark:text-pink-400">
                    Майка
                  </div>
                </div>

                {/* Father */}
                <div className="flex flex-col items-center">
                  {father ? (
                    <div className="bg-card rounded-xl shadow-lg p-4 w-64 text-center cursor-pointer hover:shadow-xl transition-shadow"
                         onClick={() => openParentModal(father)}>
                      <div className="w-full h-32 bg-muted rounded-xl overflow-hidden mb-3">
                        <img
                          src={father.image}
                          alt={father.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="font-semibold text-white mb-1">
                        {father.name}
                      </h4>
                      <p className="text-muted-foreground text-sm mb-2">
                        {father.subtitle}
                      </p>
                      <div className="flex justify-center items-center gap-1 text-xs text-muted-foreground mb-2">
                        <span>♂</span>
                        <span>•</span>
                        <span>{father.age}</span>
                      </div>
                      <div className="text-xs text-primary hover:text-primary/80">
      {t('pedigree.clickInfo')}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-muted rounded-xl border-2 border-dashed border-border p-4 w-64 h-40 flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <p className="font-medium mb-1">{t('pedigree.father')}</p>
                        <p className="text-sm">{t('pedigree.noData')}</p>
                      </div>
                    </div>
                  )}
                  <div className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                    {t('pedigree.father')}
                  </div>
                </div>
              </div>
            )}

            {/* No Parents Message */}
            {!isLoadingParents && !mother && !father && (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-lg">
                  {t('pedigree.noParentInfo')}
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                  {t('pedigree.notEntered')}
                </p>
              </div>
            )}

            {/* Additional Info */}
            <div className="bg-card rounded-xl shadow-lg p-6 w-full max-w-2xl">
              <h4 className="font-semibold text-lg text-foreground mb-4">
                {t('pedigree.catInfo')}
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">{t('pedigree.name')}</span>
                  <span className="ml-2 font-medium">{cat.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">{t('pedigree.age')}</span>
                  <span className="ml-2 font-medium">{cat.age}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">{t('pedigree.color')}</span>
                  <span className="ml-2 font-medium">{cat.color}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">{t('pedigree.status')}</span>
                  <span className={`ml-2 font-medium ${
                    cat.status === 'Достъпен' ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {cat.status}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">{t('pedigree.gender')}</span>
                  <span className="ml-2 font-medium">
                    {cat.gender === 'male' ? t('pedigree.male') : t('pedigree.female')}
                  </span>
                </div>
              </div>
              
              {cat.description && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-foreground leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              )}

              {cat.freeText && (
                <div className="mt-4 pt-4 border-t border-border">
                  <h5 className="font-medium text-foreground mb-2">
                    {t('pedigree.additionalInfo')}
                  </h5>
                  <p className="text-foreground leading-relaxed">
                    {cat.freeText}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Parent Modal */}
      {parentModalOpen && selectedParent && (
        <PedigreeModal
          cat={selectedParent}
          isOpen={parentModalOpen}
          onClose={closeParentModal}
        />
      )}
    </div>
  );
};

export default PedigreeModal;