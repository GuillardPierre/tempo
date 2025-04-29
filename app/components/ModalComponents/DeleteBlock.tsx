import { View, Pressable, StyleSheet, Vibration } from 'react-native';
import ThemedText from '../utils/ThemedText';
import { SelectedWorktime } from '@/app/types/worktime';
import { useState } from 'react';
import ENDPOINTS from '../utils/ENDPOINT';

type Props = {
	setModalVisible: (visible: boolean) => void;
	selectedWorktime: SelectedWorktime | null;
	onDeleteSuccess?: () => void;
	onCancel?: () => void;
};

export default function DeleteBlock({
	setModalVisible,
	selectedWorktime,
	onDeleteSuccess,
	onCancel,
}: Props) {
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		if (!selectedWorktime?.id) {
			console.error('No worktime selected for deletion');
			return;
		}

		setIsDeleting(true);

		try {
			const response = await fetch(
				`${ENDPOINTS}/api/worktimes/${selectedWorktime.id}`,
				{
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
				}
			);

			if (!response.ok) {
				throw new Error(`Error: ${response.status}`);
			}

			Vibration.vibrate(50);

			if (onDeleteSuccess) {
				onDeleteSuccess();
			} else {
				setModalVisible(false);
			}
		} catch (error) {
			console.error('Failed to delete worktime:', error);
		} finally {
			setIsDeleting(false);
		}
	};

	const handleCancel = () => {
		Vibration.vibrate(50);
		if (onCancel) {
			onCancel();
		} else {
			setModalVisible(false);
		}
	};

	return (
		<View style={styles.container}>
			<ThemedText variant='header2' color='secondaryText'>
				Êtes-vous sûr de vouloir supprimer ce bloc ?
			</ThemedText>

			{selectedWorktime && (
				<View style={styles.workTimeInfoContainer}>
					<ThemedText variant='body' color='secondaryText'>
						{`Catégorie: ${selectedWorktime.categoryName || 'Non spécifiée'}`}
					</ThemedText>
					<ThemedText variant='body' color='secondaryText'>
						{`Durée: ${selectedWorktime.duration || '00:00'}`}
					</ThemedText>
				</View>
			)}

			<View style={styles.buttonsContainer}>
				<Pressable
					onPress={handleDelete}
					disabled={isDeleting}
					style={[styles.button, styles.deleteButton]}
				>
					<ThemedText
						variant='header1'
						color='secondaryText'
						style={styles.buttonText}
					>
						{isDeleting ? 'Suppression...' : 'Oui'}
					</ThemedText>
				</Pressable>
				<Pressable
					onPress={handleCancel}
					style={[styles.button, styles.cancelButton]}
				>
					<ThemedText
						variant='header1'
						color='secondaryText'
						style={styles.buttonText}
					>
						Non
					</ThemedText>
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 10,
	},
	workTimeInfoContainer: {
		marginVertical: 15,
		padding: 10,
		backgroundColor: '#f5f5f5',
		borderRadius: 8,
	},
	buttonsContainer: {
		marginTop: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	button: {
		minWidth: 100,
		alignItems: 'center',
	},
	deleteButton: {
		backgroundColor: '#ffdddd',
	},
	cancelButton: {
		backgroundColor: '#C2B2FF',
	},
	buttonText: {
		fontSize: 20,
		fontWeight: 'bold',
		borderWidth: 3,
		overflow: 'hidden',
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 8,
		textAlign: 'center',
		width: '100%',
	},
});
