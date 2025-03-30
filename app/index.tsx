import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from './hooks/useThemeColors';
import Header from './components/Header';
import DateDisplay from './components/DateDisplay';
import MainWrapper from './components/MainWrapper';
import Footer from './components/Footer';
import Block from './components/Block';
import ModalMenu from './components/Modal';
import TimerForm from './forms/timerForm';
import Menu from './components/ModalComponents/Menu';
import DeleteBlock from './components/ModalComponents/DeleteBlock';
import Calendar from './components/Calendar';
import { useIndex } from './hooks/useIndex';
import { Redirect } from 'expo-router';
import React from 'react';

export default function Index() {
	const colors = useThemeColors();
	const {
		data,
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
	} = useIndex();

	return (
		<>
			<Redirect href={'/screens/auth/Login'} />

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
					{data.map((block, index) => (
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
				<MainWrapper isOpen={timerIsOpen} direction='bottom'>
					<TimerForm />
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
						<Menu />
					) : (
						<DeleteBlock setModalVisible={setModalVisible} />
					)}
				</ModalMenu>
			</SafeAreaView>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
