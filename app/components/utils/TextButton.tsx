import { useThemeColors } from '@/app/hooks/useThemeColors';
import {
	Pressable,
	StyleProp,
	StyleSheet,
	TextStyle,
	Vibration,
	View,
} from 'react-native';
import ThemedText from './ThemedText';
import { ActivityIndicator } from 'react-native-paper';

type Props = {
	onPress: () => void;
	text: string;
	style?: StyleProp<TextStyle>;
	isPending?: boolean;
};

export default function TextButton({ onPress, text, style, isPending }: Props) {
	const colors = useThemeColors();

	return (
		<Pressable
			onPress={() => {
				Vibration.vibrate(50);
				onPress();
			}}
		>
			<View style={styles.container}>
				{isPending && <ActivityIndicator animating={true} />}
				<ThemedText style={style}>{text}</ThemedText>
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 10,
	},
});
