import React from 'react';
import { Pressable, StyleSheet, Vibration, View } from 'react-native';
import { useThemeColors } from '../../hooks/useThemeColors';
import PreviousIcon from '../svg/previous';
import NextIcon from '../svg/next';
import StatsIcon from '../svg/stats';
import CalendarIcon from '../svg/calendar';
import AddIcon from '../svg/addSvg';
import CloseSvg from '../svg/close';

const types = {
  previous: PreviousIcon,
  next: NextIcon,
  stats: StatsIcon,
  calendar: CalendarIcon,
  add: AddIcon,
  close: CloseSvg,
};

type Props = {
  type: keyof typeof types;
  variant: 'primary' | 'secondary';
  btnSize?: number;
  svgSize?: number;
  onPress: () => void;
};

export default function RoundButton({
  type,
  variant,
  btnSize = 40,
  svgSize = 24,
  onPress,
}: Props) {
  const colors = useThemeColors();
  const Icon = types[type];
  return (
    <Pressable
      onPress={() => {
        Vibration.vibrate(50);
        onPress();
      }}
    >
      <View
        style={[
          styles.button,
          { backgroundColor: colors[variant], width: btnSize, height: btnSize },
        ]}
      >
        <Icon width={svgSize} height={svgSize} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
