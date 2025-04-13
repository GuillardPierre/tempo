import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Redirect } from 'expo-router';
import React from 'react';
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

export default function Homepage() {
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
		isConnected,
	} = useIndex();

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
						<Menu setModalVisible={setModalVisible} />
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
