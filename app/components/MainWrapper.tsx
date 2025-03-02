import { StyleSheet, Animated, ScrollView } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';
import { useEffect, useRef, useState } from 'react';

type Props = {
  children: React.ReactNode;
  isOpen?: boolean;
  direction?: 'top' | 'bottom'; // Ajoutez cette ligne
};

export default function MainWrapper({ children, isOpen = true, direction = 'bottom' }: Props) { // Modifiez cette ligne
  const colors = useThemeColors();
  const animation = useRef(new Animated.Value(isOpen ? 1 : 0)).current;
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Animation d'ouverture
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false
      }).start();
    } else {
      // Animation de fermeture
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false
      }).start(() => {
        setShouldRender(false); // Retire le composant après l'animation
      });
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.background,
          maxHeight: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1800]
          }),
          transform: [{
            translateY: animation.interpolate({
              inputRange: [0, 1],
              outputRange: direction === 'bottom' ? [1800, 0] : [-1800, 0] // Ajoutez cette ligne
            })
          }]
        }
      ]}
    >
      <ScrollView>
        {children}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginInline: 10,
    marginBlock: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 16,
    borderStyle: 'solid',
    borderWidth: 3,
    borderColor: '#8955FD',
    overflow: 'scroll',
    zIndex: 1
  }
});
