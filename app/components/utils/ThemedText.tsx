import { Colors } from '../../constants/colors';
import { useThemeColors } from '../../hooks/useThemeColors';
import { StyleSheet, Text, TextProps } from 'react-native';

const styles = StyleSheet.create({
	header1: {
		fontSize: 22,
		fontWeight: 700,
	},
	header2: {
		fontSize: 20,
		fontWeight: 700,
	},
	body: {
		fontSize: 14,
		fontWeight: 400,
	},
});

type Props = TextProps & {
	variant?: keyof typeof styles;
	color?: keyof (typeof Colors)['light'];
};

export default function ThemedText({ variant, color, style, ...rest }: Props) {
	const colors = useThemeColors();
	return (
		<Text
			style={[
				styles[variant ?? 'body'],
				{ color: colors[color ?? 'primaryText'] },
				style,
			]}
			{...rest}
		/>
	);
}
