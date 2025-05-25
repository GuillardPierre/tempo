import { useState } from 'react';
import { View } from 'react-native';
import ThemedText from './utils/ThemedText';
import { SegmentedButtons } from 'react-native-paper';
import { useThemeColors } from '../hooks/useThemeColors';
import AddRoundSvg from './svg/addRound';
import ClockSvg from './svg/clock';
import TimerForm from '../forms/timerForm';
import { Category } from '../types/worktime';

// Définir les props nécessaires pour TimerForm
interface WorktimeSelectActionProps {
	setSnackBar: (type: 'error' | 'info', message: string) => void;
	setTimerIsOpen: () => void;
	setWorktimes?: (worktimes: any[] | ((prevWorktimes: any[]) => any[])) => void;
	categories?: Category[];
	setCategories?: (
		categories: Category[] | ((prevCategories: Category[]) => Category[])
	) => void;
	date: string;
}

export default function WorktimeSelectAction({
	setSnackBar,
	setTimerIsOpen,
	setWorktimes,
	categories,
	setCategories,
	date,
}: WorktimeSelectActionProps) {
	const colors = useThemeColors();
	const [value, setValue] = useState<string>('');

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
				onValueChange={setValue}
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
						label: 'Chronomètre',
						value: 'startTimer',
						checkedColor: colors.primaryText,
						uncheckedColor: colors.secondaryText,
					},
					// {
					// 	icon: () => <AddRoundSvg />,
					// 	label: 'Pause',
					// 	value: 'addPause',
					// 	checkedColor: colors.primaryLight,
					// },
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
		</View>
	);
}
