import { Modal, StyleSheet, View, Pressable, Vibration } from 'react-native';

type Props = {
	children: React.ReactNode;
	modalVisible: boolean;
	setModalVisible: (visible: boolean) => void;
};

export default function ModalMenu({
	children,
	modalVisible,
	setModalVisible,
}: Props) {
	return (
		<Modal
			transparent
			visible={modalVisible}
			onRequestClose={() => setModalVisible(false)}
			animationType='fade'
			statusBarTranslucent
			presentationStyle='overFullScreen'
		>
			<View style={StyleSheet.absoluteFill}>
				<Pressable
					style={[styles.overlay, StyleSheet.absoluteFill]}
					onPress={() => {
						Vibration.vibrate(50);
						setModalVisible(false);
					}}
				>
					<View style={[styles.modalContainer]}>
						<View style={styles.modalContent}>{children}</View>
					</View>
				</Pressable>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContainer: {
		borderWidth: 7,
		borderRadius: 8,
		borderColor: '#FF8F33',
		backgroundColor: '#FFF',
		width: '90%',
		height: '40%',
		elevation: 5,
	},
	modalContent: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		gap: 10,
	},
	timerContainer: {
		width: '100%',
		height: '100%',
		position: 'relative',
		elevation: 6,
	},
});
