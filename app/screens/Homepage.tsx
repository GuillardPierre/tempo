import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect } from 'expo-router';
import React from 'react';
import { useIndex } from '@/app/hooks/useIndex';
import { useModal } from '@/app/hooks/useModal';
import { useToggleViews } from '@/app/hooks/useToggleViews';
import { useThemeColors } from '@/app/hooks/useThemeColors';
import {
	Worktime,
	RecurrenceException,
	SelectedWorktime,
} from '@/app/types/worktime';
import Header from '@/app/components/Header';
import MainWrapper from '@/app/components/MainWrapper';
import Calendar from '@/app/components/Calendar';
import Footer from '@/app/components/Footer';
import ModalMenu from '@/app/components/Modal';
import Menu from '@/app/components/ModalComponents/Menu';
import CustomSnackBar from '@/app/components/utils/CustomSnackBar';
import UpdateDeleteModal from '@/app/components/ModalComponents/UpdateDeleteModal';
import WorktimeSelectAction from '@/app/components/WorktimeSelectAction';
import ExceptionsList from '@/app/components/ExceptionsList';
import WorktimesList from '@/app/components/WorktimesList';
import UnfinishedWorktimesList from '@/app/components/UnfinishedWorktimesList';
import PauseForm from '../forms/PauseForm';
import { TOKEN } from '@/app/components/utils/querySetup';

export default function Homepage() {
	const colors = useThemeColors();
	const {
		worktimes,
		monthWorktimes,
		recurrenceExceptions,
		unfinishedWorktimes,
		categories,
		date,
		setDate,
		month,
		setMonth,
		isConnected,
		setWorktimes,
		setRecurrenceExceptions,
		setCategories,
		selectedWorktime,
		setSelectedWorktime,
		setUnfinishedWorktimes,
		color,
		open,
		message,
		setOpen,
		setSnackBar,
		selectedException,
		setSelectedException,
	} = useIndex();

	const {
		modalVisible,
		modalType,
		openModal,
		closeModal,
		setModalType,
		setModalVisible,
	} = useModal();

	const {
		calendarIsOpen,
		timerIsOpen,
		formIsOpen,
		setFormIsOpen,
		toggleCalendar,
		toggleTimer,
	} = useToggleViews();

	if (isConnected === false) {
		return <Redirect href='/screens/auth/Login' />;
	}

	const handleExceptionPress = (exception: RecurrenceException) => {
		setSelectedException(exception);
		openModal('exception');
	};

	const getSelectedWorktimeForUpdate = () => {
		if (!selectedWorktime) return null;

		const selected: SelectedWorktime = {
			...selectedWorktime,
			recurrence: selectedWorktime.recurrence
				? JSON.stringify(selectedWorktime.recurrence)
				: '',
			isRecurring: selectedWorktime.type === 'RECURRING',
			startDate: selectedWorktime.startDate,
			endDate: selectedWorktime.endDate,
		};

		return selected;
	};

	return (
		<SafeAreaView
			style={[
				styles.container,
				{
					backgroundColor: colors.primary,
				},
			]}
		>
			<StatusBar
				backgroundColor={colors.primary}
				barStyle='light-content'
			/>
			<Header
				modalVisible={modalVisible}
				setModalVisible={setModalVisible}
				setModalType={setModalType}
				date={date}
				setDate={setDate}
				setCalendarIsOpen={toggleCalendar}
			/>
			<View
				style={{
					flex: 1,
					overflow: 'hidden',
					maxHeight: '90%',
				}}
			>
				<MainWrapper
					isOpen={calendarIsOpen}
					direction='top'
					maxHeight='42%'
					style={{ marginBottom: 0 }}
				>
					<Calendar
						date={date}
						setDate={setDate}
						monthWorktimes={monthWorktimes}
						month={month}
						setMonth={setMonth}
						recurrenceExceptions={recurrenceExceptions}
					/>
				</MainWrapper>
				<UnfinishedWorktimesList
					unfinishedWorktimes={unfinishedWorktimes}
					currentDate={date}
					recurrenceExceptions={recurrenceExceptions}
					setModalType={setModalType}
					setModalVisible={setModalVisible}
					setSelectedWorktime={setSelectedWorktime}
					setUnfinishedWorktimes={setUnfinishedWorktimes}
					setWorktimes={setWorktimes}
					setSnackBar={setSnackBar}
				/>
				<MainWrapper
					fullHeight={!calendarIsOpen && !timerIsOpen}
					style={{
						maxHeight: timerIsOpen
							? formIsOpen
								? '47%'
								: '80%'
							: calendarIsOpen
							? '37%'
							: 'auto',
					}}
					flexGrow={true}
				>
					<ExceptionsList
						exceptions={recurrenceExceptions}
						date={date}
						onExceptionPress={handleExceptionPress}
					/>
					<WorktimesList
						worktimes={worktimes}
						currentDate={date}
						recurrenceExceptions={recurrenceExceptions}
						setModalType={setModalType}
						setModalVisible={setModalVisible}
						setSelectedWorktime={setSelectedWorktime}
					/>
				</MainWrapper>

				<MainWrapper
					isOpen={timerIsOpen}
					direction='bottom'
					maxHeight='35%'
					minHeight={formIsOpen ? '35%' : 'auto'}
					style={{
						paddingHorizontal: 30,
					}}
				>
					<WorktimeSelectAction
						setSnackBar={setSnackBar}
						setTimerIsOpen={toggleTimer}
						setWorktimes={setWorktimes}
						categories={categories}
						setCategories={setCategories}
						date={date}
						setFormIsOpen={setFormIsOpen}
						setRecurrenceExceptions={setRecurrenceExceptions}
						recurrenceExceptions={recurrenceExceptions}
					/>
				</MainWrapper>
			</View>

			<Footer
				setTimerIsOpen={toggleTimer}
				timerIsOpen={timerIsOpen}
				calendarIsOpen={calendarIsOpen}
				setCalendarIsOpen={toggleCalendar}
			/>

			<ModalMenu
				modalVisible={modalVisible}
				setModalVisible={setModalVisible}
			>
				{modalType === 'menu' && (
					<Menu setModalVisible={setModalVisible} />
				)}
				{modalType === 'update' && (
					<UpdateDeleteModal
						selectedWorktime={getSelectedWorktimeForUpdate()}
						setModalVisible={setModalVisible}
						categories={categories}
						setCategories={setCategories}
						setWorktimes={setWorktimes}
						setSnackBar={setSnackBar}
						date={date}
					/>
				)}
				{modalType === 'exception' && (
					<PauseForm
						selectedException={selectedException}
						setModalVisible={setModalVisible}
						setSnackBar={setSnackBar}
						setRecurrenceExceptions={setRecurrenceExceptions}
						recurrenceExceptions={recurrenceExceptions}
						date={date}
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
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
