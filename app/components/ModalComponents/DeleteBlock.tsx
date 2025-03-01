import { View, Pressable, StyleSheet, Vibration } from 'react-native';
import ThemedText from '../utils/ThemedText';

export default function DeleteBlock({
  setModalVisible,
}: {
  setModalVisible: (visible: boolean) => void;
}) {
  return (
    <View>
      <ThemedText variant='header2' color='secondaryText'>
        Êtes-vous sûr de vouloir supprimer ce bloc ?
      </ThemedText>
      <View style={styles.buttonsContainer}>
        <Pressable
          onPress={() => {
            Vibration.vibrate(50);
            setModalVisible(false);
          }}
        >
          <ThemedText
            variant='header1'
            color='secondaryText'
            style={styles.buttonText}
          >
            Oui
          </ThemedText>
        </Pressable>
        <Pressable
          onPress={() => {
            Vibration.vibrate(50);
            setModalVisible(false);
          }}
        >
          <ThemedText
            variant='header1'
            color='secondaryText'
            style={styles.buttonText}
          >
            Non
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    borderWidth: 3,
    backgroundColor: '#C2B2FF',
    borderColor: '#7B32F5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
});
