import { useState } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import AdminLogin from './AdminLogin';
import CatManager from '@/components/admin/CatManager';
import PedigreeCanvas from '@/components/admin/PedigreeCanvas';
import TikTokVideoManager from '@/components/admin/TikTokVideoManager';
import SocialMediaSettings from '@/components/admin/SocialMediaSettings';
import NewsManager from '@/components/admin/NewsManager';
import { CatData } from '@/services/convexCatService';
import ragdollLogo from '@/assets/ragdoll-logo.png';

type AdminTab = 'pedigree' | 'news' | 'tiktok' | 'social';

const Admin = () => {
  const { isAuthenticated, isLoading, logout } = useAdminAuth();
  const [selectedCat, setSelectedCat] = useState<CatData | null>(null);
  const [canvasInstance, setCanvasInstance] = useState<{ addCatToCanvas: (cat: CatData, position?: { x: number; y: number }) => void } | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('pedigree');

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Зареждане...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'pedigree':
        return (
          <div className="flex flex-col lg:flex-row min-h-0 flex-1">
            {/* Left Panel - Cat Manager */}
            <div className="w-full lg:w-2/5 bg-white lg:border-r border-b lg:border-b-0">
              <CatManager
                onCatSelect={setSelectedCat}
                selectedCat={selectedCat}
                onAddToCanvas={(cat) => {
                  setSelectedCat(cat);
                }}
                onDropCatToCanvas={(cat, position) => {
                  canvasInstance?.addCatToCanvas(cat, position);
                }}
              />
            </div>

            {/* Right Panel - Pedigree Canvas */}
            <div className="flex-1 bg-background min-h-[400px] lg:min-h-0">
              <PedigreeCanvas 
                selectedCat={selectedCat} 
                onCanvasReady={setCanvasInstance}
              />
            </div>
          </div>
        );
      case 'news':
        return <NewsManager />;
      case 'tiktok':
        return <TikTokVideoManager />;
      case 'social':
        return <SocialMediaSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center space-x-3">
            <img 
              src={ragdollLogo} 
              alt="My Pets Ragdoll Logo" 
              className="w-10 h-10 object-contain"
            />
            <h1 className="font-playfair text-xl sm:text-2xl font-semibold text-black">
              Admin Dashboard
            </h1>
          </div>
          <Button
            onClick={logout}
            variant="outline"
            className="border-black text-black hover:bg-black hover:text-white min-h-[44px] px-4"
          >
            Изход
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="flex px-4 sm:px-6 overflow-x-auto">
          {[
            { id: 'pedigree' as AdminTab, label: 'Родословие' },
            { id: 'news' as AdminTab, label: 'Новини' },
            { id: 'tiktok' as AdminTab, label: 'TikTok видеа' },
            { id: 'social' as AdminTab, label: 'Социални мрежи' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 sm:px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap min-h-[44px] ${
                activeTab === tab.id
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Admin;