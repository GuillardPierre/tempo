import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import ThemedText from './utils/ThemedText';
import { Style } from 'react-native-paper/lib/typescript/components/List/utils';

type Props = {
	text: string;
	action: () => void;
	type: 'square' | 'round';
	style?: StyleProp<ViewStyle>;
};

export default function ButtonMenu({ text, action, type, style }: Props) {
	return (
		<Pressable style={[styles.button, styles[type], style]} onPress={action}>
			<ThemedText style={styles.textButton}>{text}</ThemedText>
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
		borderWidth: 4,
		marginVertical: 5,
		paddingVertical: 8,
		paddingHorizontal: 15,
	},
	square: {
		borderRadius: 8,
		borderColor: '#8955FD',
		backgroundColor: '#C2B2FF',
	},
	round: {
		borderRadius: 9999,
		backgroundColor: '#7B32F5',
		borderColor: '#7B32F5',
	},
	textButton: {
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center',
	},
});
