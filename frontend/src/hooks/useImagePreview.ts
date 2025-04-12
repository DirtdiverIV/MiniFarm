import { useState, useCallback } from 'react';

interface UseImagePreviewReturn {
  selectedImage: string | null;
  handleImageChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => void;
  clearImage: () => void;
}

export const useImagePreview = (): UseImagePreviewReturn => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageChange = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement>,
      setFieldValue: (field: string, value: any) => void
    ) => {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        setFieldValue('image', file);
        
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target) {
            setSelectedImage(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const clearImage = useCallback(() => {
    setSelectedImage(null);
  }, []);

  return {
    selectedImage,
    handleImageChange,
    clearImage
  };
}; 