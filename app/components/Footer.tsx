import { StyleSheet, Vibration, View } from 'react-native';
import RoundButton from './utils/RoundButton';
import { useThemeColors } from '../hooks/useThemeColors';
import { useRouter } from 'expo-router';

type Props = {
  setTimerIsOpen: (isOpen: boolean) => void;
  timerIsOpen: boolean;
};

export default function Footer({ setTimerIsOpen, timerIsOpen }: Props) {
  const colors = useThemeColors();
  const router = useRouter();
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
        onPress={() => {
          Vibration.vibrate(50);
          router.push('/screens/CalendarScreen');
        }}
      />
      <RoundButton
        type='add'
        variant='secondary'
        btnSize={50}
        onPress={() => {
          Vibration.vibrate(50);
          setTimerIsOpen(!timerIsOpen);
        }}
      />
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
