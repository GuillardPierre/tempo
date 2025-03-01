import { StyleSheet, Vibration, View } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';

import RoundButton from './utils/RoundButton';
import ThemedText from './utils/ThemedText';

type Props = {
  date: Date;
  setDate: (date: Date) => void;
};

export default function DateDisplay({ date, setDate }: Props) {
  const colors = useThemeColors();

  const handlePrevious = () => {
    Vibration.vibrate(50);
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);
    setDate(newDate);
  };

  const handleNext = () => {
    Vibration.vibrate(50);
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    setDate(newDate);
  };

  return (
    <View style={[styles.dateDisplay, { backgroundColor: colors.secondary }]}>
      <RoundButton
        type='previous'
        variant='primary'
        svgSize={15}
        onPress={handlePrevious}
      />
      <ThemedText variant='header2' color='primaryText'>
        {date.toLocaleDateString()}
      </ThemedText>
      <RoundButton
        type='next'
        variant='primary'
        svgSize={15}
        onPress={handleNext}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dateDisplay: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    paddingBlock: 10,
  },
});
