import { StyleSheet, Vibration, View, Animated } from 'react-native';
import RoundButton from './utils/RoundButton';
import { useThemeColors } from '../hooks/useThemeColors';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';

type Props = {
  setTimerIsOpen: (isOpen: boolean) => void;
  timerIsOpen: boolean;
};

export default function Footer({ setTimerIsOpen, timerIsOpen }: Props) {
  const colors = useThemeColors();
  const router = useRouter();
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [buttonType, setButtonType] = useState<'add' | 'minus'>('add');

  const handleAddPress = () => {
    Vibration.vibrate(50);
    setTimerIsOpen(!timerIsOpen);
    
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      rotateAnim.setValue(0);
      setButtonType(buttonType === 'add' ? 'minus' : 'add');
    });
  };

  const handleCalendarPress = () => {
    Vibration.vibrate(50);
    if (router.canGoBack()) {
      router.push('/');
    } else {
      router.push('/screens/CalendarScreen');
    }
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <RoundButton
        type='stats'
        variant='secondary'
        btnSize={50}
        onPress={() => {
          Vibration.vibrate(50);
        }}
      />
      <RoundButton
        type='calendar'
        variant='secondary'
        btnSize={50}
        onPress={handleCalendarPress}
      />
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <RoundButton
          type={buttonType}
          variant='secondary'
          btnSize={50}
          svgSize={buttonType === "add" ? 24 : 30}
          onPress={handleAddPress}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 50,
    paddingVertical: 10,
  },
});
