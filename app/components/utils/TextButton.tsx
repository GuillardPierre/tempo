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
import { tuple } from 'zod';

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
				<ThemedText style={[style, styles.base]}>
					{true && (
						<ActivityIndicator
							style={{ transform: [{ translateY: 4 }], paddingRight: 5 }}
							animating={true}
						/>
					)}
					{text}
				</ThemedText>
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
	base: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
});
