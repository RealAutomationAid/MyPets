import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSettingsByType } from '@/services/convexSiteSettingsService';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
  }
}

const Analytics = () => {
  const analyticsSettings = useSettingsByType('analytics');
  const seoSettings = useSettingsByType('seo');

  // Parse settings into usable format
  const settings = analyticsSettings?.reduce((acc, setting) => {
    try {
      acc[setting.key] = JSON.parse(setting.value);
    } catch {
      acc[setting.key] = setting.value;
    }
    return acc;
  }, {} as Record<string, string>) || {};

  const seoData = seoSettings?.reduce((acc, setting) => {
    try {
      acc[setting.key] = JSON.parse(setting.value);
    } catch {
      acc[setting.key] = setting.value;
    }
    return acc;
  }, {} as Record<string, string>) || {};

  const googleAnalyticsId = settings.google_analytics_id;
  const metaPixelId = settings.meta_pixel_id;
  const googleSearchConsole = settings.google_search_console;

  // Get current page SEO data
  const currentPath = window.location.pathname;
  let pageSeoData = seoData.home_seo_title ? {
    title: seoData.home_seo_title,
    description: seoData.home_seo_description,
    keywords: seoData.home_seo_keywords
  } : {};

  if (currentPath.includes('gallery')) {
    pageSeoData = {
      title: seoData.gallery_seo_title || pageSeoData.title,
      description: seoData.gallery_seo_description || pageSeoData.description,
      keywords: seoData.gallery_seo_keywords || pageSeoData.keywords
    };
  } else if (currentPath.includes('contact')) {
    pageSeoData = {
      title: seoData.contact_seo_title || pageSeoData.title,
      description: seoData.contact_seo_description || pageSeoData.description,
      keywords: seoData.contact_seo_keywords || pageSeoData.keywords
    };
  }

  // Initialize Google Analytics
  useEffect(() => {
    if (!googleAnalyticsId) return;

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`;
    document.head.appendChild(script);

    // Initialize Google Analytics
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', googleAnalyticsId, {
      page_title: pageSeoData.title || document.title,
      page_location: window.location.href,
    });

    return () => {
      // Cleanup script on unmount
      const scriptElement = document.querySelector(`script[src*="${googleAnalyticsId}"]`);
      if (scriptElement) {
        document.head.removeChild(scriptElement);
      }
    };
  }, [googleAnalyticsId, pageSeoData.title]);

  // Initialize Meta Pixel
  useEffect(() => {
    if (!metaPixelId) return;

    // Meta Pixel initialization code
    (function(f: Window, b: Document, e: string, v: string) {
      interface FacebookPixel {
        (...args: unknown[]): void;
        callMethod?: {
          apply: (thisArg: unknown, args: unknown[]) => void;
        };
        queue: unknown[];
        push: FacebookPixel;
        loaded: boolean;
        version: string;
      }

      if ((f as typeof window & { fbq?: FacebookPixel }).fbq) return; 
      const n: FacebookPixel = function(...args: unknown[]) {
        n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
      } as FacebookPixel;
      
      if (!(f as typeof window & { _fbq?: FacebookPixel })._fbq) {
        (f as typeof window & { _fbq?: FacebookPixel })._fbq = n;
      }
      
      n.push = n; 
      n.loaded = true; 
      n.version = '2.0';
      n.queue = []; 
      
      const t = b.createElement(e) as HTMLScriptElement; 
      t.async = true;
      t.src = v; 
      const s = b.getElementsByTagName(e)[0];
      s.parentNode?.insertBefore(t, s);
      
      (f as typeof window & { fbq?: FacebookPixel }).fbq = n;
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq?.('init', metaPixelId);
    window.fbq?.('track', 'PageView');

    return () => {
      // Cleanup on unmount
      const scriptElement = document.querySelector('script[src*="fbevents.js"]');
      if (scriptElement) {
        document.head.removeChild(scriptElement);
      }
    };
  }, [metaPixelId]);

  return (
    <Helmet>
      {/* SEO Meta Tags */}
      {pageSeoData.title && (
        <title>{pageSeoData.title}</title>
      )}
      {pageSeoData.description && (
        <meta name="description" content={pageSeoData.description} />
      )}
      {pageSeoData.keywords && (
        <meta name="keywords" content={pageSeoData.keywords} />
      )}

      {/* Google Search Console Verification */}
      {googleSearchConsole && (
        <meta name="google-site-verification" content={googleSearchConsole} />
      )}

      {/* Open Graph Meta Tags */}
      {pageSeoData.title && (
        <meta property="og:title" content={pageSeoData.title} />
      )}
      {pageSeoData.description && (
        <meta property="og:description" content={pageSeoData.description} />
      )}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={window.location.href} />
      <meta property="og:site_name" content="My Pets Ragdoll - Radanov Pride" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      {pageSeoData.title && (
        <meta name="twitter:title" content={pageSeoData.title} />
      )}
      {pageSeoData.description && (
        <meta name="twitter:description" content={pageSeoData.description} />
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={window.location.href} />

      {/* Meta Pixel noscript fallback */}
      {metaPixelId && (
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      )}
    </Helmet>
  );
};

export default Analytics;