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
import { useThemeColors } from '@/app/hooks/useThemeColors';
import CustomSnackBar from '@/app/components/utils/CustomSnackBar';
import useSnackBar from '@/app/hooks/useSnackBar';
import UpdateDeleteModal from '@/app/components/ModalComponents/UpdateDeleteModal';

export default function Homepage() {
	const colors = useThemeColors();
	const {
		worktimes,
		monthWorktimes,
		unfinishedWorktimes,
		categories,
		date,
		setDate,
		month,
		setMonth,
		modalVisible,
		setModalVisible,
		modalType,
		setModalType,
		timerIsOpen,
		setTimerIsOpen,
		calendarIsOpen,
		setCalendarIsOpen,
		isConnected,
		setWorktimes,
		setCategories,
		selectedWorktime,
		setSelectedWorktime,
		setUnfinishedWorktimes
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
				<DateDisplay
					date={date}
					setDate={setDate}
					setCalendarIsOpen={setCalendarIsOpen}
				/>
				<MainWrapper isOpen={calendarIsOpen} direction='top'>
					<Calendar
						date={date}
						setDate={setDate}
						monthWorktimes={monthWorktimes}
						month={month}
						setMonth={setMonth}
					/>
				</MainWrapper>
				{unfinishedWorktimes.length > 0 && (
					<MainWrapper height={110}>
						{unfinishedWorktimes.map((worktime, index) => (
							<Block
								key={worktime.id}
								worktime={worktime}
								setModalType={setModalType}
								setModalVisible={setModalVisible}
								setSelectedWorktime={setSelectedWorktime}
								setWorktimes={setWorktimes}
								setUnfinishedWorktimes={setUnfinishedWorktimes}
								setSnackBar={setSnackBar}
								currentDate={date}
							/>
						))}
					</MainWrapper>
				)}
				<MainWrapper>
					{worktimes
						.filter((worktime) => worktime.endTime !== null)
						.map((worktime, index) => (
							<Block
								key={worktime.id}
								worktime={worktime}
								setModalType={setModalType}
								setModalVisible={setModalVisible}
								setSelectedWorktime={setSelectedWorktime}
								currentDate={date}
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
						date={date}
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
					// disableScroll={modalType === 'update'}
				>
					{modalType === 'menu' && <Menu setModalVisible={setModalVisible} />}
					{modalType === 'update' && (
						<UpdateDeleteModal
							selectedWorktime={selectedWorktime}
							setModalVisible={setModalVisible}
							categories={categories}
							setCategories={setCategories}
							setWorktimes={setWorktimes}
							setSnackBar={setSnackBar}
						/>
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
