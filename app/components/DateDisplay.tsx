import { Pressable, StyleSheet, View } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';

import RoundButton from './utils/RoundButton';
import ThemedText from './utils/ThemedText';
import { useDateDisplay } from '../hooks/useDateDisplay';
import { useDateFormatter } from '../hooks/useDateFormatter';

type Props = {
	date: string;
	setDate: (date: string) => void;
	setCalendarIsOpen: () => void;
};

export default function DateDisplay({
	date,
	setDate,
	setCalendarIsOpen,
}: Props) {
	const colors = useThemeColors();
	const { handlePrevious, handleNext } = useDateDisplay(date, setDate);
	const { formatDate, getDayName } = useDateFormatter();

	return (
		<View style={[styles.dateDisplay, { backgroundColor: colors.primary }]}>
			<RoundButton
				type='previousDate'
				variant='primary'
				svgSize={15}
				onPress={handlePrevious}
			/>
			<Pressable onPress={setCalendarIsOpen}>
				<View style={styles.dateContainer}>
					<ThemedText variant='header2' color='primaryText'>
						{formatDate(date)}
					</ThemedText>
					<ThemedText variant='body' color='primaryText' style={styles.dayName}>
						{getDayName(date)}
					</ThemedText>
				</View>
			</Pressable>
			<RoundButton
				type='nextDate'
				variant='primary'
				svgSize={15}
				onPress={handleNext}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	dateDisplay: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 20,
	},
	dateContainer: {
		alignItems: 'center',
	},
	dayName: {
		fontSize: 14,
		marginTop: 2,
	},
});
