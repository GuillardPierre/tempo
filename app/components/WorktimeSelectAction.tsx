import { useEffect, useState } from 'react';
import { Vibration, View } from 'react-native';
import ThemedText from './utils/ThemedText';
import { SegmentedButtons } from 'react-native-paper';
import { useThemeColors } from '../hooks/useThemeColors';
import AddRoundSvg from './svg/addRound';
import ClockSvg from './svg/clock';
import TimerForm from '../forms/timerForm';
import { Category, RecurrenceException } from '../types/worktime';
import PauseForm from '../forms/PauseForm';

// Définir les props nécessaires pour TimerForm
interface WorktimeSelectActionProps {
	setSnackBar: (type: 'error' | 'info', message: string) => void;
	setTimerIsOpen: () => void;
	setWorktimes?: (
		worktimes: any[] | ((prevWorktimes: any[]) => any[])
	) => void;
	categories?: Category[];
	setCategories?: (
		categories: Category[] | ((prevCategories: Category[]) => Category[])
	) => void;
	date: string;
	setFormIsOpen: (isOpen: boolean) => void;
	setRecurrenceExceptions: (
		recurrenceExceptions:
			| RecurrenceException[]
			| ((
					prevRecurrenceExceptions: RecurrenceException[]
			  ) => RecurrenceException[])
	) => void;
	recurrenceExceptions: RecurrenceException[];
	setChronoOpen: (isOpen: boolean) => void; // Nouvelle prop
}

export default function WorktimeSelectAction({
	setSnackBar,
	setTimerIsOpen,
	setWorktimes,
	categories,
	setCategories,
	date,
	setFormIsOpen,
	setRecurrenceExceptions,
	recurrenceExceptions,
	setChronoOpen, // Nouvelle prop
}: WorktimeSelectActionProps) {
	const colors = useThemeColors();
	const [value, setValue] = useState<string>('');

	useEffect(() => {
		const isFormOpen = value === 'addWorktime' ||
			value === 'startTimer' ||
			value === 'addPause';
		
		setFormIsOpen(isFormOpen);
		
		// Notifier si le chrono est ouvert
		setChronoOpen(value === 'startTimer');
	}, [value, setFormIsOpen, setChronoOpen]);

	return (
		<View style={{ gap: 10 }}>
			{value === '' && (
				<ThemedText
					variant='body'
					color='secondaryText'
					style={{ marginLeft: 20 }}
				>
					Choisissez une action :
				</ThemedText>
			)}
			<SegmentedButtons
				value={value}
				onValueChange={(newValue) => {
					Vibration.vibrate(50);
					setValue(newValue);
				}}
				density='regular'
				theme={{
					colors: {
						secondaryContainer: colors.primaryLight,
					},
				}}
				style={{
					borderWidth: 3,
					borderColor: colors.primary,
					borderRadius: 25,
					backgroundColor: colors.background,
				}}
				buttons={[
					{
						icon: () => <AddRoundSvg />,
						label: 'Activité',
						value: 'addWorktime',
						checkedColor: colors.primaryText,
						uncheckedColor: colors.secondaryText,
					},
					{
						icon: () => <ClockSvg />,
						label: 'Chrono',
						value: 'startTimer',
						checkedColor: colors.primaryText,
						uncheckedColor: colors.secondaryText,
					},
					{
						icon: () => <AddRoundSvg />,
						label: 'Pause',
						value: 'addPause',
						checkedColor: colors.primaryText,
						uncheckedColor: colors.secondaryText,
					},
				]}
			/>

			{value === 'addWorktime' && (
				<TimerForm
					mode='activity'
					setSnackBar={setSnackBar}
					setTimerIsOpen={setTimerIsOpen}
					setWorktimes={setWorktimes}
					categories={categories}
					setCategories={setCategories}
					date={date}
				/>
			)}
			{value === 'startTimer' && (
				<TimerForm
					mode='chrono'
					setSnackBar={setSnackBar}
					setTimerIsOpen={setTimerIsOpen}
					setWorktimes={setWorktimes}
					categories={categories}
					setCategories={setCategories}
					date={date}
				/>
			)}
			{value === 'addPause' && (
				<PauseForm
					setSnackBar={setSnackBar}
					setTimerIsOpen={setTimerIsOpen}
					date={date}
					setRecurrenceExceptions={setRecurrenceExceptions}
					recurrenceExceptions={recurrenceExceptions}
					setModalVisible={setTimerIsOpen}
				/>
			)}
		</View>
	);
}
