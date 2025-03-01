import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from './hooks/useThemeColors';
import Header from './components/Header';
import DateDisplay from './components/DateDisplay';
import { useState } from 'react';
import MainWrapper from './components/MainWrapper';
import Footer from './components/Footer';
import BlockTime from './components/BlockTime';
import Block from './components/Block';
import ModalMenu from './components/Modal';
import TimerForm from './forms/timerForm';
import Menu from './components/ModalComponents/Menu';
import DeleteBlock from './components/ModalComponents/DeleteBlock';

const blockData = [
  {
    type: 'time',
    text: 'Correction',
    startTime: '08:00',
    endTime: '12:00',
    duration: '4h',
  },
  {
    type: 'time',
    text: "Préparation spectacle fin d'année",
    startTime: '12:00',
    endTime: '13:00',
    duration: '1h',
  },
  {
    type: 'time',
    text: 'Work',
    startTime: '13:00',
    endTime: '17:00',
    duration: '4h',
  },
  {
    type: 'time',
    text: 'Work',
    startTime: '17:00',
    endTime: '18:00',
    duration: '1h',
  },
  {
    type: 'time',
    text: 'Work',
    startTime: '18:00',
    endTime: '19:00',
    duration: '1h',
  },
  {
    type: 'time',
    text: 'Work',
    startTime: '19:00',
    endTime: '20:00',
    duration: '1h',
  },
  {
    type: 'time',
    text: 'Work',
    startTime: '20:00',
    endTime: '21:00',
    duration: '1h',
  },
  {
    type: 'time',
    text: 'Work',
    startTime: '21:00',
    endTime: '22:00',
    duration: '1h',
  },
  {
    type: 'time',
    text: 'Work',
    startTime: '22:00',
    endTime: '23:00',
    duration: '1h',
  },
  {
    type: 'time',
    text: 'Work',
    startTime: '23:00',
    endTime: '00:00',
    duration: '1h',
  },
  {
    type: 'time',
    text: 'Sleep',
    startTime: '00:00',
    endTime: '08:00',
    duration: '8h',
  },
];

export default function Index() {
  const colors = useThemeColors();
  const [date, setDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'menu' | 'delete'>('menu');
  const [blockToDelete, setBlockToDelete] = useState<number | null>(null);
  const [timerIsOpen, setTimerIsOpen] = useState(false);

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: colors.primary,
        },
      ]}
    >
      <StatusBar backgroundColor={colors.primary} barStyle='light-content' />
      <Header
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setModalType={setModalType}
      />
      <DateDisplay date={date} setDate={setDate} />
      <MainWrapper>
        {blockData.map((block, index) => (
          <Block
            key={index}
            type={block.type as 'time' | 'button'}
            text={block.text}
            startTime={block.startTime}
            endTime={block.endTime}
            duration={block.duration}
            setModalType={setModalType}
            setModalVisible={setModalVisible}
            setBlockToDelete={setBlockToDelete}
          />
        ))}
      </MainWrapper>
      <MainWrapper isOpen={timerIsOpen}>
        <TimerForm />
      </MainWrapper>
      <Footer setTimerIsOpen={setTimerIsOpen} timerIsOpen={timerIsOpen} />
      <ModalMenu modalVisible={modalVisible} setModalVisible={setModalVisible}>
        {modalType === 'menu' ? (
          <Menu />
        ) : (
          <DeleteBlock setModalVisible={setModalVisible} />
        )}
      </ModalMenu>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
