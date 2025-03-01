import { StyleSheet, View } from 'react-native';
import ThemedText from './ThemedText';

type Props = {
  children: React.ReactNode;
};

export default function CustomChip({ children }: Props) {
  return (
    <View style={styles.container}>
      <ThemedText>{children}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#8955FD',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
});
