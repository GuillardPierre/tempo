import {
	StyleSheet,
	Animated,
	ScrollView,
	StyleProp,
	ViewStyle,
	Dimensions,
} from 'react-native';
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
	maxHeight?: number | `${number}%` | 'auto';
	minHeight?: number | `${number}%` | 'auto';
	style?: StyleProp<ViewStyle>;
};

export default function MainWrapper({
	children,
	isOpen = true,
	direction = 'bottom',
	flexGrow = false,
	disableScroll = false,
	height,
	fullHeight = false,
	maxHeight,
	minHeight,
	style,
}: Props) {
	const colors = useThemeColors();
	const animation = useRef(new Animated.Value(isOpen ? 1 : 0)).current;
	const animatedHeight = useRef(
		new Animated.Value(isOpen && typeof height === 'number' ? height : 0)
	).current;
	const [shouldRender, setShouldRender] = useState(isOpen);
	const screenHeight = Dimensions.get('window').height;

	useEffect(() => {
		if (isOpen) {
			setShouldRender(true);
			const animations = [
				Animated.timing(animation, {
					toValue: 1,
					duration: 100,
					useNativeDriver: false,
				}),
			];
			if (typeof height === 'number') {
				animations.push(
					Animated.timing(animatedHeight, {
						toValue: height,
						duration: 100,
						useNativeDriver: false,
					})
				);
			}
			Animated.parallel(animations).start();
		} else {
			const animations = [
				Animated.timing(animation, {
					toValue: 0,
					duration: 100,
					useNativeDriver: false,
				}),
			];
			if (typeof height === 'number') {
				animations.push(
					Animated.timing(animatedHeight, {
						toValue: 0,
						duration: 100,
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

	const getMaxHeight = () => {
		if (typeof maxHeight === 'number') {
			return maxHeight;
		}
		if (typeof maxHeight === 'string' && maxHeight.endsWith('%')) {
			const percentage = parseInt(maxHeight, 10);
			return (screenHeight * percentage) / 100;
		}
		if (maxHeight === 'auto') {
			return undefined;
		}
		return undefined;
	};

	const getMinHeight = () => {
		if (typeof minHeight === 'number') {
			return minHeight;
		}
		if (typeof minHeight === 'string' && minHeight.endsWith('%')) {
			const percentage = parseInt(minHeight, 10);
			return (screenHeight * percentage) / 100;
		}
		if (minHeight === 'auto') {
			return undefined;
		}
		return undefined;
	};

	const containerStyle = {
		...styles.container,
		...(flexGrow ? styles.flexContainer : {}),
		...(fullHeight ? { flex: 1 } : {}),
		backgroundColor: colors.background,
		...(typeof height === 'number'
			? { height: animatedHeight, maxHeight: animatedHeight }
			: {}),
		maxHeight: getMaxHeight(),
		minHeight: getMinHeight(),
		transform: [
			{
				translateY: animation.interpolate({
					inputRange: [0, 1],
					outputRange: direction === 'bottom' ? [50, 0] : [-300, 0],
				}),
			},
		],
		...(style as object),
	};

	if (disableScroll) {
		return <Animated.View style={containerStyle}>{children}</Animated.View>;
	}

	return (
		<Animated.View style={containerStyle}>
			<ScrollView
				removeClippedSubviews={true}
				keyboardShouldPersistTaps='handled'
				showsVerticalScrollIndicator={true}
				contentContainerStyle={styles.scrollContent}
				bounces={false}
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
		overflow: 'hidden',
	},
	flexContainer: {
		flexGrow: 1,
	},
	scrollContent: {
		flexGrow: 1,
	},
});
