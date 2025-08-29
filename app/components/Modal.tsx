import { StyleSheet, View, ScrollView } from 'react-native';
import { Portal, Modal } from 'react-native-paper';
import { useThemeColors } from '../hooks/useThemeColors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../context/authContext';

const modalQueryClient = new QueryClient();

type Props = {
	children: React.ReactNode;
	modalVisible: boolean;
	setModalVisible: (visible: boolean) => void;
	disableScroll?: boolean;
};

export default function ModalMenu({
	children,
	modalVisible,
	setModalVisible,
	disableScroll = false, // Par défaut, le scroll est activé
}: Props) {
	const colors = useThemeColors();

	return (
		<Portal>
			<Modal
				visible={modalVisible}
				onDismiss={() => setModalVisible(false)}
				contentContainerStyle={styles.modalContainer}
			>
				<QueryClientProvider client={modalQueryClient}>
					<AuthProvider>
						{disableScroll ? (
							<View style={styles.modalContent}>{children}</View>
						) : (
							<ScrollView
								style={styles.scrollContainer}
								contentContainerStyle={styles.scrollContent}
								keyboardShouldPersistTaps='handled'
								removeClippedSubviews={true}
							>
								<View style={styles.modalContent}>
									{children}
								</View>
							</ScrollView>
						)}
					</AuthProvider>
				</QueryClientProvider>
			</Modal>
		</Portal>
	);
}

const styles = StyleSheet.create({
	modalContainer: {
		backgroundColor: '#FFF',
		borderWidth: 5,
		borderRadius: 16,
		borderColor: '#FF8F33',
		width: '98%',
		maxHeight: '80%',
		elevation: 5,
		marginHorizontal: 'auto',
		alignSelf: 'center',
		overflow: 'visible',
	},
	scrollContainer: {
		width: '100%',
		flexGrow: 0,
		overflow: 'hidden',
	},
	scrollContent: {
		flexGrow: 1,
		padding: 10,
		overflow: 'visible',
	},
	modalContent: {
		width: '100%',
		padding: 10,
		overflow: 'visible',
	},
});
