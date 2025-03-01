import { ScrollView, StyleSheet, View } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';

type Props = {
  isOpen?: boolean;
  children: React.ReactNode;
};

export default function MainWrapper({ isOpen = true, children }: Props) {
  const colors = useThemeColors();

  if (!isOpen) {
    return null;
  }

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView style={styles.scrollView}>{children}</ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FF0000',
  },
  container: {
    flex: 1,
    marginInline: 10,
    marginBlock: 5,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 16,
    borderStyle: 'solid',
    borderWidth: 3,
    borderColor: '#8955FD',
  },
  scrollView: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
});
