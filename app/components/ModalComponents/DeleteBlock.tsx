import { View, Pressable, StyleSheet, Vibration } from 'react-native';
import ThemedText from '../utils/ThemedText';
import { SelectedWorktime, Worktime } from '@/app/types/worktime';
import { useState } from 'react';
import ENDPOINTS from '../utils/ENDPOINT';
import { formatDateWihtoutTime } from '../utils/utils';
import { Button } from 'react-native-paper';
import { httpDelete } from '../utils/querySetup';

type Props = {
	setModalVisible: (visible: boolean) => void;
	setWorktimes: (
		worktimes: Worktime[] | ((prev: Worktime[]) => Worktime[])
	) => void;
	selectedWorktime: SelectedWorktime | null;
	onDeleteSuccess?: () => void;
	onCancel?: () => void;
	setSnackBar?: (type: 'error' | 'info', messageText: string) => void;
};

export default function DeleteBlock({
	setModalVisible,
	selectedWorktime,
	onDeleteSuccess,
	onCancel,
	setWorktimes,
	setSnackBar,
}: Props) {
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		if (!selectedWorktime?.id) {
			console.error('No worktime selected for deletion');
			if (setSnackBar) setSnackBar('error', 'Aucune entrée sélectionnée');
			return;
		}

		setIsDeleting(true);
		const endpoint =
			selectedWorktime.type === 'SINGLE'
				? ENDPOINTS.worktime.root
				: ENDPOINTS.woktimeSeries.root;

		try {
			const response = await httpDelete(`${endpoint}${selectedWorktime.id}`);

			if (!response.ok) {
				if (setSnackBar)
					setSnackBar(
						'error',
						`Erreur lors de la suppression (${response.status})`
					);
				throw new Error(`Error: ${response.status}`);
			}

			Vibration.vibrate(50);
			setWorktimes((prevWorktimes) =>
				prevWorktimes.filter((worktime) => worktime.id !== selectedWorktime.id)
			);
			if (setSnackBar) setSnackBar('info', 'Suppression réussie');
			if (onDeleteSuccess) {
				onDeleteSuccess();
			} else {
				setModalVisible(false);
			}
		} catch (error) {
			console.error('Failed to delete worktime:', error);
			if (setSnackBar) setSnackBar('error', 'La suppression a échoué');
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
				Êtes-vous sûr de vouloir supprimer cette entrée ?
			</ThemedText>

			{selectedWorktime && (
				<View style={styles.workTimeInfoContainer}>
					<ThemedText variant='body' color='secondaryText'>
						{`Catégorie: ${selectedWorktime.categoryName || 'Non spécifiée'}`}
					</ThemedText>
					<ThemedText variant='body' color='secondaryText'>
						{`Du ${
							formatDateWihtoutTime(selectedWorktime.startTime) || '00:00'
						}`}
					</ThemedText>
				</View>
			)}

			<View style={styles.buttonsContainer}>
				<Button onPress={handleDelete} disabled={isDeleting} mode='contained'>
					Oui
				</Button>
				<Button
					onPress={handleCancel}
					disabled={isDeleting}
					mode='contained-tonal'
				>
					Non
				</Button>
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
		justifyContent: 'space-around',
	},
});
