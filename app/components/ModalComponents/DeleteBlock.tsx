import { View, Pressable, StyleSheet, Vibration } from 'react-native';
import ThemedText from '../utils/ThemedText';
import { SelectedWorktime, WorktimeSeries } from '@/app/types/worktime';
import { useState } from 'react';
import ENDPOINTS from '../utils/ENDPOINT';
import { Button } from 'react-native-paper';
import { httpDelete } from '../utils/querySetup';
import ButtonMenu from '../ButtonMenu';
import { useThemeColors } from '@/app/hooks/useThemeColors';
import { useDateFormatter } from '@/app/hooks/useDateFormatter';

type Props = {
	setModalVisible: (visible: boolean) => void;
	setWorktimes: (
		worktimes:
			| WorktimeSeries[]
			| ((prev: WorktimeSeries[]) => WorktimeSeries[])
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
	const colors = useThemeColors();
	const { formatDateRange } = useDateFormatter();
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		Vibration.vibrate(50);
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
			const response = await httpDelete(
				`${endpoint}${selectedWorktime.id}`
			);

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
				prevWorktimes.filter(
					(worktime) => worktime.id !== selectedWorktime.id
				)
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

	console.log('selectedWorktime', selectedWorktime);

	return (
		<View style={styles.container}>
			<ThemedText variant='header2' color='secondaryText'>
				Êtes-vous sûr de vouloir supprimer cette entrée ?
			</ThemedText>

			{selectedWorktime && (
				<View style={styles.workTimeInfoContainer}>
					<ThemedText variant='body' color='secondaryText'>
						{`Catégorie: ${
							selectedWorktime.categoryName || 'Non spécifiée'
						}`}
					</ThemedText>
					<ThemedText variant='body' color='secondaryText'>
						{formatDateRange(
							selectedWorktime.start,
							selectedWorktime.end,
							selectedWorktime.type
						)}
					</ThemedText>
				</View>
			)}

			<View style={styles.buttonsContainer}>
				<ButtonMenu action={handleCancel} type='round' text='Non' />
				<ButtonMenu
					action={handleDelete}
					type='round'
					style={{ backgroundColor: colors.error }}
					text='Oui'
				/>
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
		width: '50%',
		gap: 10,
		marginTop: 20,
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
});
