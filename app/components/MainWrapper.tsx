import { StyleSheet, Animated, ScrollView } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';
import { useEffect, useRef, useState } from 'react';

type Props = {
	children: React.ReactNode;
	isOpen?: boolean;
	direction?: 'top' | 'bottom';
	flexGrow?: boolean;
	disableScroll?: boolean;
	height?: number;
	fullHeight?: boolean;
};

export default function MainWrapper({
	children,
	isOpen = true,
	direction = 'bottom',
	flexGrow = false,
	disableScroll = false,
	height,
	fullHeight = false,
}: Props) {
	const colors = useThemeColors();
	const animation = useRef(new Animated.Value(isOpen ? 1 : 0)).current;
	const animatedHeight = useRef(
		new Animated.Value(isOpen && typeof height === 'number' ? height : 0)
	).current;
	const [shouldRender, setShouldRender] = useState(isOpen);

	useEffect(() => {
		if (isOpen) {
			setShouldRender(true);
			const animations = [
				Animated.timing(animation, {
					toValue: 1,
					duration: 300,
					useNativeDriver: false,
				}),
			];
			if (typeof height === 'number') {
				animations.push(
					Animated.timing(animatedHeight, {
						toValue: height,
						duration: 300,
						useNativeDriver: false,
					})
				);
			}
			Animated.parallel(animations).start();
		} else {
			const animations = [
				Animated.timing(animation, {
					toValue: 0,
					duration: 300,
					useNativeDriver: false,
				}),
			];
			if (typeof height === 'number') {
				animations.push(
					Animated.timing(animatedHeight, {
						toValue: 0,
						duration: 300,
						useNativeDriver: false,
					})
				);
			}
			Animated.parallel(animations).start(() => {
				setShouldRender(false);
			});
		}
	}, [isOpen, height]);

	if (!shouldRender) return null;

	// Si disableScroll est true, retourner simplement les enfants dans une Animated.View
	if (disableScroll) {
		return (
			<Animated.View
				style={[
					styles.container,
					flexGrow ? styles.flexContainer : {},
					fullHeight ? { height: '100%' } : {},
					// fullHeight ? { flex: 1 } : {},
					{
						backgroundColor: colors.background,
						...(typeof height === 'number'
							? { height: animatedHeight, maxHeight: animatedHeight }
							: {}),
						transform: [
							{
								translateY: animation.interpolate({
									inputRange: [0, 1],
									outputRange: direction === 'bottom' ? [300, 0] : [-300, 0],
								}),
							},
						],
					},
				]}
			>
				{children}
			</Animated.View>
		);
	}

	// Sinon, utiliser un ScrollView
	return (
		<Animated.View
			style={[
				styles.container,
				flexGrow ? styles.flexContainer : {},
				fullHeight ? { flex: 1 } : {},
				{
					backgroundColor: colors.background,
					...(typeof height === 'number' ? { height: animatedHeight } : {}),
					transform: [
						{
							translateY: animation.interpolate({
								inputRange: [0, 1],
								outputRange: direction === 'bottom' ? [300, 0] : [-300, 0],
							}),
						},
					],
				},
			]}
		>
			<ScrollView
				removeClippedSubviews={true}
				keyboardShouldPersistTaps='handled'
				showsVerticalScrollIndicator={true}
			>
				{children}
			</ScrollView>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginInline: 10,
		marginBlock: 5,
		paddingHorizontal: 10,
		paddingVertical: 10,
		borderRadius: 16,
		borderStyle: 'solid',
		borderWidth: 2,
		borderColor: '#7678ED',
		zIndex: 1,
		overflow: 'hidden',
	},
	flexContainer: {
		flexGrow: 1,
	},
	scrollContent: {
		flexGrow: 1,
	},
});
