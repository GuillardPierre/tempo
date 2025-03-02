import { StyleSheet, Vibration, View, Animated } from 'react-native';
import RoundButton from './utils/RoundButton';
import { useThemeColors } from '../hooks/useThemeColors';
import { useFooter } from '../hooks/useFooter';

type Props = {
	setTimerIsOpen: (isOpen: boolean) => void;
	timerIsOpen: boolean;
	calendarIsOpen: boolean;
	setCalendarIsOpen: (isOpen: boolean) => void;
};

export default function Footer({
	setTimerIsOpen,
	timerIsOpen,
	calendarIsOpen,
	setCalendarIsOpen,
}: Props) {
	const colors = useThemeColors();
	const {
		buttonType,
		setButtonType,
		handleAddPress,
		handleCalendarPress,
		spin,
		calendarSpin,
	} = useFooter({
		setTimerIsOpen,
		timerIsOpen,
		calendarIsOpen,
		setCalendarIsOpen,
	});

	return (
		<View style={[styles.container, { backgroundColor: colors.primary }]}>
			<RoundButton
				type='stats'
				variant='secondary'
				btnSize={50}
				onPress={() => {
					Vibration.vibrate(50);
				}}
			/>
			<Animated.View style={{ transform: [{ rotate: calendarSpin }] }}>
				<RoundButton
					type='calendar'
					variant='secondary'
					btnSize={50}
					onPress={handleCalendarPress}
				/>
			</Animated.View>
			<Animated.View style={{ transform: [{ rotate: spin }] }}>
				<RoundButton
					type={buttonType}
					variant='secondary'
					btnSize={50}
					svgSize={buttonType === 'add' ? 24 : 30}
					onPress={handleAddPress}
				/>
			</Animated.View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		height: 80,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 50,
		paddingVertical: 10,
		zIndex: 5,
	},
});
