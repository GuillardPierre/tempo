import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect } from 'expo-router';
import React, { useEffect } from 'react';
import { useIndex } from '@/app/hooks/useIndex';
import Header from '@/app/components/Header';
import DateDisplay from '@/app/components/DateDisplay';
import MainWrapper from '@/app/components/MainWrapper';
import Calendar from '@/app/components/Calendar';
import Block from '@/app/components/Block';
import TimerForm from '@/app/forms/timerForm';
import Footer from '@/app/components/Footer';
import ModalMenu from '@/app/components/Modal';
import Menu from '@/app/components/ModalComponents/Menu';
import DeleteBlock from '@/app/components/ModalComponents/DeleteBlock';
import { useThemeColors } from '@/app/hooks/useThemeColors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import CustomSnackBar from '@/app/components/utils/CustomSnackBar';
import useSnackBar from '@/app/hooks/useSnackBar';

export default function Homepage() {
  const colors = useThemeColors();
  const {
    worktimes,
    date,
    setDate,
    modalVisible,
    setModalVisible,
    modalType,
    setModalType,
    blockToDelete,
    setBlockToDelete,
    timerIsOpen,
    setTimerIsOpen,
    calendarIsOpen,
    setCalendarIsOpen,
    isConnected,
    setIsConnected,
    setWorktimes,
  } = useIndex();

  const { color, open, message, setOpen, setSnackBar } = useSnackBar();

  useEffect(() => {
    AsyncStorage.getItem('token').then((token) => {
      console.log('token réel:', token);
      if (token) {
        console.log('decoded token', jwtDecode(token));
      }
    });
  }, []);

  if (isConnected === null) {
    <Redirect href={'/screens/auth/Login'} />;
  }

  return (
    <>
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
        <MainWrapper isOpen={calendarIsOpen} direction='top'>
          <Calendar date={date} setDate={setDate} />
        </MainWrapper>
        <MainWrapper>
          {worktimes.map((worktime, index) => (
            <Block
              key={index}
              type={'time'}
              text={worktime.category.name}
              startTime={worktime.startTime}
              endTime={worktime.endTime}
              duration={worktime.duration}
              setModalType={setModalType}
              setModalVisible={setModalVisible}
              setBlockToDelete={setBlockToDelete}
            />
          ))}
        </MainWrapper>
        <MainWrapper
          isOpen={timerIsOpen}
          direction='bottom'
          flexGrow={timerIsOpen}
        >
          <TimerForm
            setSnackBar={setSnackBar}
            setTimerIsOpen={setTimerIsOpen}
            setWorktimes={setWorktimes}
          />
        </MainWrapper>
        <Footer
          setTimerIsOpen={setTimerIsOpen}
          timerIsOpen={timerIsOpen}
          calendarIsOpen={calendarIsOpen}
          setCalendarIsOpen={setCalendarIsOpen}
        />
        <ModalMenu
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        >
          {modalType === 'menu' ? (
            <Menu setModalVisible={setModalVisible} />
          ) : (
            <DeleteBlock setModalVisible={setModalVisible} />
          )}
        </ModalMenu>
        <CustomSnackBar
          color={color}
          message={message}
          open={open}
          setOpen={setOpen}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
