import { StatusBar, View } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ModalMenu from '../components/Modal';
import { useState } from 'react';
import ThemedText from '../components/utils/ThemedText';

// type Props = {
//   modalVisible: boolean;
//   setModalVisible: (visible: boolean) => void;
// };

export default function CalendarScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const colors = useThemeColors();
  return (
    <SafeAreaView>
      <StatusBar backgroundColor={colors.primary} barStyle='light-content' />
      <Header modalVisible={modalVisible} setModalVisible={setModalVisible} />
      <View>
        <ThemedText style={{ color: colors.secondaryText }}>
          Page calendrier
        </ThemedText>
      </View>
      <Footer />
      <ModalMenu
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </SafeAreaView>
  );
}
