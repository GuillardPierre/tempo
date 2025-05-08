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
};

export default function MainWrapper({
	children,
	isOpen = true,
	direction = 'bottom',
	flexGrow = false,
	disableScroll = false,
	height = 1000,
}: Props) {
	const colors = useThemeColors();
	const animation = useRef(new Animated.Value(isOpen ? 1 : 0)).current;
	const [shouldRender, setShouldRender] = useState(isOpen);

	useEffect(() => {
		if (isOpen) {
			setShouldRender(true);
			// Animation d'ouverture
			Animated.timing(animation, {
				toValue: 1,
				duration: 300,
				useNativeDriver: false,
			}).start();
		} else {
			// Animation de fermeture
			Animated.timing(animation, {
				toValue: 0,
				duration: 300,
				useNativeDriver: false,
			}).start(() => {
				setShouldRender(false);
			});
		}
	}, [isOpen]);

	if (!shouldRender) return null;

	// Si disableScroll est true, retourner simplement les enfants dans une Animated.View
	if (disableScroll) {
		return (
			<Animated.View
				style={[
					styles.container,
					flexGrow ? styles.flexContainer : {},
					{
						backgroundColor: colors.background,
						maxHeight: animation.interpolate({
							inputRange: [0, 1],
							outputRange: ['0%', '100%'],
						}),
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
				{
					backgroundColor: colors.background,
					maxHeight: height,
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
				removeClippedSubviews={true} // Aide à améliorer les performances
				keyboardShouldPersistTaps='handled' // Meilleure gestion du clavier
				showsVerticalScrollIndicator={true}
			>
				{children}
			</ScrollView>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
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
