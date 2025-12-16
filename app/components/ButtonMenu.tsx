import { Pressable, StyleProp, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import ThemedText from './utils/ThemedText';
import { useThemeColors } from '../hooks/useThemeColors';
import { Colors } from '../constants/colors';

type Props = {
	text: string;
	action: () => void;
	type: 'square' | 'round';
	style?: StyleProp<ViewStyle>;
	fullWidth?: boolean;
	pending?: boolean;
	color?: keyof (typeof Colors)['light'];
};

export default function ButtonMenu({
	text,
	action,
	type,
	style,
	fullWidth = true,
	pending = false,
	color = "primaryText",
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
			onPress={pending ? undefined : action}
		>
			{pending && (
				<ActivityIndicator style={{ marginRight: 10 }} color={colors.primaryText} />
			) }
			<ThemedText variant='body' style={styles.textButton} color={type === 'round' ? color : 'secondaryText'}>
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
		borderWidth: 1,
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
