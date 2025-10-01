import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

export const useImagePicker = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 1,
      allowsEditing: true,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setImageUri(null);
  };

  return { imageUri, pickImage, removeImage };
}