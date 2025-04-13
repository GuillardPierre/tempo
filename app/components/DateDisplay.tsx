import { StyleSheet, View } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';

import RoundButton from './utils/RoundButton';
import ThemedText from './utils/ThemedText';
import { useDateDisplay } from '../hooks/useDateDisplay';

type Props = {
	date: string;
	setDate: (date: string) => void;
};

export default function DateDisplay({ date, setDate }: Props) {
	const colors = useThemeColors();
	const { handlePrevious, handleNext } = useDateDisplay(date, setDate);

	return (
		<View style={[styles.dateDisplay, { backgroundColor: colors.secondary }]}>
			<RoundButton
				type='previous'
				variant='primary'
				svgSize={15}
				onPress={handlePrevious}
			/>
			<ThemedText variant='header2' color='primaryText'>
				{(() => {
					const d = new Date(date);
					const day = String(d.getDate()).padStart(2, '0');
					const month = String(d.getMonth() + 1).padStart(2, '0');
					const year = d.getFullYear();
					return `${day}/${month}/${year}`;
				})()}
			</ThemedText>
			<RoundButton
				type='next'
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
		paddingBlock: 10,
		zIndex: 5,
	},
});
