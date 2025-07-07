import { useRef, useCallback } from 'react';
import { Animated, Dimensions, PanResponder } from 'react-native';
import { WorktimeSeries, WorktimeByDay } from '../types/worktime';

const { width: screenWidth } = Dimensions.get('window');
const SWIPE_THRESHOLD = 100;
const HORIZONTAL_MOVEMENT_THRESHOLD = 20; // Seuil minimum pour détecter un mouvement horizontal
const VERTICAL_MOVEMENT_THRESHOLD = 30; // Seuil pour détecter un mouvement vertical

interface UseSwipeAnimationProps {
	setDate: (date: string) => void;
	currentDateRef: React.RefObject<string>;
	setWorktimesByDay: (
		worktimes: WorktimeByDay | ((prev: WorktimeByDay) => WorktimeByDay)
	) => void;
}

export const useSwipeAnimation = ({
	setDate,
	currentDateRef,
	setWorktimesByDay,
}: UseSwipeAnimationProps) => {
	const swipeTranslateX = useRef(new Animated.Value(0)).current;
	const isAnimating = useRef(false);
	const isScrollingVertically = useRef(false);

	// Fonction pour détecter si l'utilisateur est en train de scroller verticalement
	const checkVerticalScroll = (dx: number, dy: number) => {
		const isVertical =
			Math.abs(dy) > VERTICAL_MOVEMENT_THRESHOLD &&
			Math.abs(dy) > Math.abs(dx) * 1.2;
		if (isVertical) {
			isScrollingVertically.current = true;
			// Reset après un délai
			setTimeout(() => {
				isScrollingVertically.current = false;
			}, 500);
		}
		return isVertical;
	};

	const handleSwipeNext = useCallback(() => {
		try {
			if (!currentDateRef?.current) {
				console.error('currentDateRef.current est undefined');
				return;
			}

			const currentDate = new Date(currentDateRef.current);
			currentDate.setDate(currentDate.getDate() + 1);
			const newDate = currentDate.toISOString().split('T')[0];

			// Mise à jour immédiate des worktimes pour fluidifier la transition
			// On garde les données de tomorrow temporairement pour éviter un flash vide
			setWorktimesByDay((prev) => ({
				yesterday: prev.today,
				today: prev.tomorrow,
				tomorrow: prev.tomorrow, // Garde temporairement les mêmes données
			}));

			// Petit délai pour laisser l'animation se terminer avant de changer la date
			setTimeout(() => {
				setDate(newDate);
			}, 150);
		} catch (error) {
			console.error('Erreur dans handleSwipeNext:', error);
		}
	}, [setDate, currentDateRef, setWorktimesByDay]);

	const handleSwipePrevious = useCallback(() => {
		try {
			if (!currentDateRef?.current) {
				console.error('currentDateRef.current est undefined');
				return;
			}

			const currentDate = new Date(currentDateRef.current);
			currentDate.setDate(currentDate.getDate() - 1);
			const newDate = currentDate.toISOString().split('T')[0];

			// Mise à jour immédiate des worktimes pour fluidifier la transition
			// On garde les données de yesterday temporairement pour éviter un flash vide
			setWorktimesByDay((prev) => ({
				yesterday: prev.yesterday, // Garde temporairement les mêmes données
				today: prev.yesterday,
				tomorrow: prev.today,
			}));

			// Petit délai pour laisser l'animation se terminer avant de changer la date
			setTimeout(() => {
				setDate(newDate);
			}, 150);
		} catch (error) {
			console.error('Erreur dans handleSwipePrevious:', error);
		}
	}, [setDate, currentDateRef, setWorktimesByDay]);

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
				const { dx, dy } = gestureState;

				// Vérifier si l'utilisateur est en train de scroller verticalement
				if (checkVerticalScroll(dx, dy)) {
					return false;
				}

				// Si on était en train de scroller verticalement, ne pas interférer
				if (isScrollingVertically.current) {
					return false;
				}

				const isHorizontalMovement =
					Math.abs(dx) > HORIZONTAL_MOVEMENT_THRESHOLD;
				const isVerticalMovement =
					Math.abs(dy) > VERTICAL_MOVEMENT_THRESHOLD;

				return (
					!isAnimating.current &&
					isHorizontalMovement &&
					Math.abs(dx) > Math.abs(dy) * 1.5 && // Le mouvement horizontal doit être significativement plus important
					!isVerticalMovement // Pas de mouvement vertical significatif
				);
			},
			onPanResponderMove: (evt, gestureState) => {
				const { dx, dy } = gestureState;

				// Si l'utilisateur commence à scroller verticalement pendant le swipe horizontal
				if (
					Math.abs(dy) > VERTICAL_MOVEMENT_THRESHOLD &&
					Math.abs(dy) > Math.abs(dx) * 1.2
				) {
					isScrollingVertically.current = true;
					// Annuler le swipe horizontal
					swipeTranslateX.setValue(0);
					return;
				}

				swipeTranslateX.setValue(gestureState.dx);
			},
			onPanResponderRelease: (evt, gestureState) => {
				try {
					const { dx } = gestureState;
					if (Math.abs(dx) > SWIPE_THRESHOLD) {
						const direction = dx > 0 ? 'previous' : 'next';
						isAnimating.current = true;
						const variation = direction === 'next' ? 11 : -11;

						Animated.timing(swipeTranslateX, {
							toValue:
								dx > 0
									? screenWidth + variation
									: -screenWidth + variation,
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
