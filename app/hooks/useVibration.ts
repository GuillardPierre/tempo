import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export const useVibration = () => {
  const vibrate = async () => {
    // Solution simple : désactiver temporairement les vibrations
    // Décommentez la ligne suivante pour désactiver toutes les vibrations
    return;
    
    try {
      if (Platform.OS === 'ios') {
        // Sur iOS, Haptics respecte automatiquement les préférences système
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else {
        // Sur Android, utiliser Haptics qui respecte mieux les préférences
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      // Fallback silencieux si les haptics ne sont pas disponibles
      console.warn('Haptics not available:', error);
    }
  };

  return { vibrate };
};
