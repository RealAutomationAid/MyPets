import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import News from "./pages/News";
import NewsArticle from "./pages/NewsArticle";
import Analytics from "./components/Analytics";
import { LocationBasedTheme } from "@/hooks/useTheme";
import { Helmet } from 'react-helmet-async';
import { LanguageProvider, useLanguage } from "@/hooks/useLanguage";

const AppContent = () => {
  const { t } = useLanguage();
  
  return (
    <>
      <Toaster />
      <Sonner />
      <Analytics />
      <Helmet>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
      </Helmet>
      <LocationBasedTheme>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<NewsArticle />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </LocationBasedTheme>
    </>
  );
};

const App = () => (
  <LanguageProvider>
    <AppContent />
  </LanguageProvider>
);

export default App;
