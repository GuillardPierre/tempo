import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import ThemedText from './utils/ThemedText';
import { useThemeColors } from '../hooks/useThemeColors';
type Props = {
	text: string;
	action: () => void;
	type: 'square' | 'round';
	style?: StyleProp<ViewStyle>;
	fullWidth?: boolean;
};

export default function ButtonMenu({
	text,
	action,
	type,
	style,
	fullWidth = true,
}: Props) {
	const colors = useThemeColors();
	return (
		<Pressable
			style={[
				styles.button,
				styles[type],
				{ backgroundColor: type === 'round' ? colors.primaryLight : "", borderColor: colors.primary },
				!fullWidth && { width: 'auto', minWidth: 50, paddingHorizontal: 12 },
				style,
			]}
			onPress={action}
		>
			<ThemedText variant='body' style={styles.textButton} color={type === 'round' ? 'primaryText' : 'secondaryText'}>
				{text}
			</ThemedText>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	button: {
		minHeight: 50,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		borderStyle: 'solid',
		borderWidth: 3,
		marginVertical: 5,
		paddingVertical: 8,
		paddingHorizontal: 15,
	},
	square: {
		borderRadius: 8,
	},
	round: {
		borderRadius: 9999,
	},
	textButton: {
		fontSize: 18,
		fontWeight: '500',
		textAlign: 'center',
	},
});
