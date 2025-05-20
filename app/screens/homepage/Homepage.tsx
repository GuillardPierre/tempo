import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, useRouter } from 'expo-router';
import React from 'react';
import { useIndex } from '@/app/hooks/useIndex';
import Header from '@/app/components/Header';
import DateDisplay from '@/app/components/DateDisplay';
import MainWrapper from '@/app/components/MainWrapper';
import Calendar from '@/app/components/Calendar';
import Block from '@/app/components/Block';
import Footer from '@/app/components/Footer';
import ModalMenu from '@/app/components/Modal';
import Menu from '@/app/components/ModalComponents/Menu';
import { useThemeColors } from '@/app/hooks/useThemeColors';
import CustomSnackBar from '@/app/components/utils/CustomSnackBar';
import UpdateDeleteModal from '@/app/components/ModalComponents/UpdateDeleteModal';
import BlockWrapper from '@/app/components/BlockWrapper';
import ThemedText from '@/app/components/utils/ThemedText';
import RoundButton from '@/app/components/utils/RoundButton';
import WorktimeSelectAction from '@/app/components/WorktimeSelectAction';

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
		setUnfinishedWorktimes,
		color,
		open,
		message,
		setOpen,
		setSnackBar,
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
				<DateDisplay
					date={date}
					setDate={setDate}
					setCalendarIsOpen={setCalendarIsOpen}
				/>
				<View style={{ flex: 1, zIndex: 99999, overflow: 'hidden' }}>
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
					<MainWrapper fullHeight={true}>
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
						{worktimes.length === 0 && (
							<BlockWrapper backgroundColor={colors.primaryLight}>
								<View style={{ flex: 1, justifyContent: 'center' }}>
									<ThemedText variant='body' color='primaryText'>
										Rien de prévu pour ce jour-ci !{' '}
									</ThemedText>
									<View
										style={{
											flexDirection: 'row',
											alignItems: 'center',
											flexWrap: 'wrap',
										}}
									>
										<ThemedText variant='body' color='primaryText'>
											Reposez-vous ou appuyez sur
										</ThemedText>
										<View style={{ marginHorizontal: 4 }}>
											<RoundButton
												onPress={() => {}}
												svgSize={12}
												type='add'
												variant='secondary'
												btnSize={25}
											/>
										</View>
										<ThemedText variant='body' color='primaryText'>
											pour enregistrer une activité
										</ThemedText>
									</View>
								</View>
							</BlockWrapper>
						)}
					</MainWrapper>
					<MainWrapper
						isOpen={timerIsOpen}
						direction='bottom'
						flexGrow={false}
						style={{ paddingHorizontal: 30 }}
					>
						<WorktimeSelectAction
							setSnackBar={setSnackBar}
							setTimerIsOpen={setTimerIsOpen}
							setWorktimes={setWorktimes}
							categories={categories}
							setCategories={setCategories}
							date={date}
						/>
					</MainWrapper>
				</View>
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
					{modalType === 'update' && (
						<UpdateDeleteModal
							selectedWorktime={selectedWorktime}
							setModalVisible={setModalVisible}
							categories={categories}
							setCategories={setCategories}
							setWorktimes={setWorktimes}
							setSnackBar={setSnackBar}
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
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
