import { Pressable, StyleSheet } from 'react-native';
import ThemedText from './utils/ThemedText';

type Props = {
	text: string;
	action: () => void;
	type: 'square' | 'round';
};

export default function ButtonMenu({ text, action, type }: Props) {
	return (
		<Pressable style={[styles.button, styles[type]]} onPress={action}>
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
		width: '90%',
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
