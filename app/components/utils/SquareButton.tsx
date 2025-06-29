import React from 'react';
import { Image, Pressable, StyleSheet, Vibration, View } from 'react-native';
import CloseSvg from '../svg/close';
import MenuSvg from '../svg/menu';
import { useThemeColors } from '@/app/hooks/useThemeColors';

const types = {
	close: CloseSvg,
	menu: MenuSvg,
};

type Props = {
	type?: keyof typeof types;
	onPress: () => void;
};

export default function SquareButton({ type, onPress }: Props) {
	const colors = useThemeColors();
	const Icon = types[type ?? 'close'];

	return (
		<Pressable
			onPress={() => {
				Vibration.vibrate(50);
				onPress();
			}}
		>
			<View style={[styles.button, { backgroundColor: colors.primary }]}>
				<Icon
					width={type === 'close' ? 18 : 44}
					height={type === 'close' ? 18 : 44}
				/>
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	button: {
		width: 52,
		height: 52,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
