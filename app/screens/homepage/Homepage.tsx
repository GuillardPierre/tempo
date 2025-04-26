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
import CustomSnackBar from '@/app/components/utils/CustomSnackBar';
import useSnackBar from '@/app/hooks/useSnackBar';

export default function Homepage() {
	const colors = useThemeColors();
	const {
		worktimes,
		categories,
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
		setCategories,
	} = useIndex();

	const { color, open, message, setOpen, setSnackBar } = useSnackBar();

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
							text={worktime.categoryName}
							startTime={worktime.startTime}
							endTime={worktime.endTime}
							duration={worktime.duration}
							worktimeType={worktime.type}
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
						categories={categories}
						setCategories={setCategories}
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
					{modalType === 'menu' && <Menu setModalVisible={setModalVisible} />}
					{modalType === 'delete' && (
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
