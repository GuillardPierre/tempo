import { router } from 'expo-router';
import { useRef, useState, useEffect } from 'react';
import { Animated, Vibration } from 'react-native';

type Props = {
	setTimerIsOpen: () => void;
	timerIsOpen: boolean;
	calendarIsOpen: boolean;
	setCalendarIsOpen: () => void;
};

export const useFooter = ({
	setTimerIsOpen,
	timerIsOpen,
	calendarIsOpen,
	setCalendarIsOpen,
}: Props) => {
	const rotateAnim = useRef(new Animated.Value(0)).current;
	const calendarRotateAnim = useRef(new Animated.Value(0)).current;
	const [buttonType, setButtonType] = useState<'add' | 'minus'>('add');

	// Synchronisation avec timerIsOpen
	useEffect(() => {
		setButtonType(timerIsOpen ? 'minus' : 'add');
	}, [timerIsOpen]);

	const handleAddPress = () => {
		Vibration.vibrate(50);
		setTimerIsOpen();

		Animated.timing(rotateAnim, {
			toValue: 1,
			duration: 300,
			useNativeDriver: true,
		}).start(() => {
			rotateAnim.setValue(0);
			setButtonType(buttonType === 'add' ? 'minus' : 'add');
		});
	};

	const handleCalendarPress = () => {
		Vibration.vibrate(50);
		setCalendarIsOpen();

		Animated.timing(calendarRotateAnim, {
			toValue: 1,
			duration: 300,
			useNativeDriver: true,
		}).start(() => {
			calendarRotateAnim.setValue(0);
		});
	};

	const spin = rotateAnim.interpolate({
		inputRange: [0, 1],
		outputRange: ['0deg', '360deg'],
	});

	const calendarSpin = calendarRotateAnim.interpolate({
		inputRange: [0, 1],
		outputRange: ['0deg', '360deg'],
	});

	const handleStatsPress = () => {
		Vibration.vibrate(50);
		router.push('/screens/charts');
	};

	return {
		buttonType,
		setButtonType,
		handleAddPress,
		handleCalendarPress,
		spin,
		calendarSpin,
		handleStatsPress,
	};
};
