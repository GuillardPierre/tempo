import { StyleSheet, Animated, ScrollView } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';
import { useEffect, useRef, useState } from 'react';

type Props = {
	children: React.ReactNode;
	isOpen?: boolean;
	direction?: 'top' | 'bottom';
	flexGrow?: boolean; // Propriété pour permettre au conteneur de prendre toute la hauteur disponible
};

export default function MainWrapper({
	children,
	isOpen = true,
	direction = 'bottom',
	flexGrow = false, // Par défaut, pas de croissance flexible
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
				setShouldRender(false); // Retire le composant après l'animation
			});
		}
	}, [isOpen]);

	if (!shouldRender) return null;

	return (
		<Animated.View
			style={[
				styles.container,
				flexGrow ? styles.flexContainer : {}, // Applique flexGrow: 1 si nécessaire
				{
					backgroundColor: colors.background,
					maxHeight: animation.interpolate({
						inputRange: [0, 1],
						outputRange: ['0%', '100%'], // Utilise une valeur relative au lieu d'une valeur fixe
					}),
					transform: [
						{
							translateY: animation.interpolate({
								inputRange: [0, 1],
								outputRange: direction === 'bottom' ? [300, 0] : [-300, 0], // Valeurs plus modérées pour l'animation
							}),
						},
					],
				},
			]}
		>
			<ScrollView contentContainerStyle={flexGrow ? styles.scrollContent : {}}>
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
		borderWidth: 3,
		borderColor: '#8955FD',
		overflow: 'hidden',
		zIndex: 1,
	},
	flexContainer: {
		flexGrow: 1,
	},
	scrollContent: {
		flexGrow: 1,
	},
});
