import { useThemeColors } from '@/app/hooks/useThemeColors';
import { Pressable, StyleProp, TextStyle, Vibration } from 'react-native';
import ThemedText from './ThemedText';

type Props = {
	onPress: () => void;
	text: string;
	style?: StyleProp<TextStyle>;
};

export default function TextButton({ onPress, text, style }: Props) {
	const colors = useThemeColors();

	return (
		<Pressable
			onPress={() => {
				Vibration.vibrate(50);
				onPress();
			}}
		>
			<ThemedText style={style}>{text}</ThemedText>
		</Pressable>
	);
}
