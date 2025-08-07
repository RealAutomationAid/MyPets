import { useMemo } from 'react';
import { Id } from "../../convex/_generated/dataModel";

type ModalType = 'pedigree' | 'gallery' | 'contact';

export const useCatURL = () => {
  const baseURL = typeof window !== 'undefined' ? window.location.origin : '';

  const generateCatURL = useMemo(() => {
    return (catId: Id<"cats">, modalType?: ModalType) => {
      if (!baseURL) return '';
      
      const params = new URLSearchParams();
      params.set('cat', catId);
      if (modalType) {
        params.set('modal', modalType);
      }
      
      return `${baseURL}/?${params.toString()}`;
    };
  }, [baseURL]);

  const generateShareableText = useMemo(() => {
    return (catId: Id<"cats">, catName: string, modalType?: ModalType) => {
      const url = generateCatURL(catId, modalType);
      const modalText = modalType === 'pedigree' ? 'родословието на' : 
                       modalType === 'gallery' ? 'галерията на' : 
                       modalType === 'contact' ? 'информацията за' : '';
      
      return `Вижте ${modalText} ${catName} в BleuRoi Ragdoll: ${url}`;
    };
  }, [generateCatURL]);

  const copyToClipboard = async (catId: Id<"cats">, modalType?: ModalType) => {
    const url = generateCatURL(catId, modalType);
    if (!url) return false;

    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  };

  return {
    generateCatURL,
    generateShareableText,
    copyToClipboard
  };
};