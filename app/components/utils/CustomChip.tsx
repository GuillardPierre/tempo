import { StyleSheet, View } from 'react-native';
import ThemedText from './ThemedText';
import { useThemeColors } from '../../hooks/useThemeColors';

type Props = {
  children: React.ReactNode;
};

export default function CustomChip({ children }: Props) {
  const colors = useThemeColors();
  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <ThemedText>{children}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
});
