import { useRef, useCallback } from 'react';
import { Animated, Dimensions, PanResponder } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const SWIPE_THRESHOLD = 100;

interface UseSwipeAnimationProps {
	setDate: (date: string) => void;
	currentDateRef: React.MutableRefObject<string>;
}

export const useSwipeAnimation = ({
	setDate,
	currentDateRef,
}: UseSwipeAnimationProps) => {
	const swipeTranslateX = useRef(new Animated.Value(0)).current;
	const isAnimating = useRef(false);

	const handleSwipeNext = useCallback(() => {
		try {
			if (!currentDateRef?.current) {
				console.error('currentDateRef.current est undefined');
				return;
			}

			const currentDate = new Date(currentDateRef.current);
			currentDate.setDate(currentDate.getDate() + 1);
			const newDate = currentDate.toISOString().split('T')[0];

			setTimeout(() => {
				setDate(newDate);
			}, 0);
		} catch (error) {
			console.error('Erreur dans handleSwipeNext:', error);
		}
	}, [setDate, currentDateRef]);

	const handleSwipePrevious = useCallback(() => {
		try {
			if (!currentDateRef?.current) {
				console.error('currentDateRef.current est undefined');
				return;
			}

			const currentDate = new Date(currentDateRef.current);
			currentDate.setDate(currentDate.getDate() - 1);
			const newDate = currentDate.toISOString().split('T')[0];

			setTimeout(() => {
				setDate(newDate);
			}, 0);
		} catch (error) {
			console.error('Erreur dans handleSwipePrevious:', error);
		}
	}, [setDate, currentDateRef]);

	const handleSwipe = useCallback(
		(direction: 'next' | 'previous') => {
			if (direction === 'next') {
				handleSwipeNext();
			} else {
				handleSwipePrevious();
			}
		},
		[handleSwipeNext, handleSwipePrevious]
	);

	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => {
				return !isAnimating.current;
			},
			onMoveShouldSetPanResponder: (evt, gestureState) => {
				return (
					!isAnimating.current &&
					Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
					Math.abs(gestureState.dx) > 10
				);
			},
			onPanResponderMove: (evt, gestureState) => {
				swipeTranslateX.setValue(gestureState.dx);
			},
			onPanResponderRelease: (evt, gestureState) => {
				try {
					const { dx } = gestureState;
					if (Math.abs(dx) > SWIPE_THRESHOLD) {
						const direction = dx > 0 ? 'previous' : 'next';
						isAnimating.current = true;

						Animated.timing(swipeTranslateX, {
							toValue: dx > 0 ? screenWidth : -screenWidth,
							duration: 300,
							useNativeDriver: true,
						}).start(() => {
							handleSwipe(direction);
							requestAnimationFrame(() => {
								swipeTranslateX.setValue(0);
								isAnimating.current = false;
							});
						});
					} else {
						Animated.spring(swipeTranslateX, {
							toValue: 0,
							tension: 100,
							friction: 8,
							useNativeDriver: true,
						}).start();
					}
				} catch (error) {
					console.error('Erreur dans le swipe:', error);
					swipeTranslateX.setValue(0);
					isAnimating.current = false;
				}
			},
		})
	).current;

	const swipeAnimatedStyle = {
		transform: [{ translateX: swipeTranslateX }],
		flex: 1,
	};

	return {
		swipeAnimatedStyle,
		panResponder,
	};
};
