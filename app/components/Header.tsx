import { Pressable, StyleSheet, Vibration, View } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';
import ThemedText from './utils/ThemedText';
import SquareButton from './utils/SquareButton';
import { router, usePathname } from 'expo-router';
import ArrowBackSvg from './svg/arrowback';
import type { ModalType } from '@/app/types/modal';
import { Dispatch, SetStateAction } from 'react';

type Props = {
	modalVisible: boolean;
	setModalVisible: (visible: boolean) => void;
	setModalType: (type: ModalType) => void;
};

export default function Header({
	modalVisible,
	setModalVisible,
	setModalType,
}: Props) {
	const colors = useThemeColors();
	const pathname = usePathname();
	return (
		<View style={[styles.header, { backgroundColor: colors.primary }]}>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				{router.canGoBack() && pathname !== '/screens/Homepage' && (
					<Pressable
						style={{
							backgroundColor: colors.secondary,
							borderRadius: 100,
							padding: 5,
							marginRight: 10,
						}}
						onPress={() => router.back()}
					>
						<ArrowBackSvg fill={colors.primaryText} />
					</Pressable>
				)}
				<ThemedText variant='header1' color='primaryText'>
					Tempos
				</ThemedText>
			</View>
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
