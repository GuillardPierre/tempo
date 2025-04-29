import { StyleSheet, Vibration, View } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';
import ThemedText from './utils/ThemedText';
import SquareButton from './utils/SquareButton';

type Props = {
	modalVisible: boolean;
	setModalVisible: (visible: boolean) => void;
	setModalType: (type: 'menu' | 'update') => void;
};

export default function Header({
	modalVisible,
	setModalVisible,
	setModalType,
}: Props) {
	const colors = useThemeColors();
	return (
		<View style={[styles.header, { backgroundColor: colors.primary }]}>
			<ThemedText variant='header1' color='primaryText'>
				Temp-o-s
			</ThemedText>
			<SquareButton
				type={modalVisible ? 'close' : 'menu'}
				onPress={() => {
					Vibration.vibrate(50);
					setModalVisible(!modalVisible);
					setModalType('menu');
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		paddingHorizontal: 16,
		paddingVertical: 8,
		zIndex: 5,
	},
});
