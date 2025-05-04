import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import ThemedText from '../utils/ThemedText';
import { SelectedWorktime, Worktime } from '@/app/types/worktime';
import TimerForm from '@/app/forms/timerForm';
import ButtonMenu from '../ButtonMenu';
import DeleteBlock from './DeleteBlock';
import { useThemeColors } from '@/app/hooks/useThemeColors';
import { Button } from 'react-native-paper';
import useSnackBar from '@/app/hooks/useSnackBar';

type Props = {
	setModalVisible: (visible: boolean) => void;
	selectedWorktime: SelectedWorktime | null;
	categories: any[];
	setCategories: (categories: any[] | ((prev: any[]) => any[])) => void;
	setWorktimes: (
		worktimes: Worktime[] | ((prev: Worktime[]) => Worktime[])
	) => void;
	setSnackBar: (type: 'error' | 'info', messageText: string) => void;
};

export default function UpdateDeleteModal({
	setModalVisible,
	selectedWorktime,
	categories = [],
	setCategories,
	setWorktimes,
	setSnackBar,
}: Props) {
	const colors = useThemeColors();
	const [mode, setMode] = useState<'view' | 'edit' | 'delete'>('view');
	const [snackBarMessage, setSnackBarMessage] = useState<{
		type: 'error' | 'info';
		message: string;
	} | null>(null);

	const formatDate = (dateString: string | undefined): string => {
		if (!dateString) return '';
		const date = new Date(dateString);
		const hours = date.getHours().toString().padStart(2, '0');
		const minutes = date.getMinutes().toString().padStart(2, '0');
		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const year = date.getFullYear();
		return `${hours}:${minutes} ${day}-${month}-${year}`;
	};

	const handleUpdateSuccess = () => {
		setSnackBarMessage({
			type: 'info',
			message: 'Modification réussie',
		});
		setMode('view');
		setModalVisible(false);
	};

	const handleDeleteSuccess = () => {
		setSnackBarMessage({
			type: 'info',
			message: 'Suppression réussie',
		});
		setModalVisible(false);
	};

	return (
		<View style={styles.container}>
			{mode === 'view' && (
				<View style={styles.viewContainer}>
					<View style={styles.header}>
						<ThemedText
							variant='body'
							color='secondaryText'
							style={{ textAlign: 'center' }}
						>
							{`${selectedWorktime?.categoryName} - ${formatDate(
								selectedWorktime?.startTime
							)}`}
						</ThemedText>
					</View>

					<View style={styles.buttonsContainer}>
						<Button
							mode='elevated'
							onPress={() => setMode('edit')}
							buttonColor={colors.primary}
							textColor='white'
							style={styles.actionButton}
						>
							Modifier
						</Button>
						<Button
							mode='elevated'
							buttonColor={colors.error}
							textColor='white'
							onPress={() => setMode('delete')}
							style={styles.actionButton}
						>
							Supprimer
						</Button>
					</View>
				</View>
			)}

			{mode === 'edit' && (
				<View style={styles.editContainer}>
					<View style={styles.header}>
						<ThemedText variant='body' color='secondaryText'>
							{`Modification de l'entrée`}
						</ThemedText>
					</View>

					<View style={styles.formContainer}>
						<TimerForm
							setSnackBar={setSnackBar}
							setTimerIsOpen={setModalVisible}
							setWorktimes={setWorktimes}
							categories={categories}
							setCategories={setCategories}
							selectedWorktime={selectedWorktime}
							isEditing={true}
							onUpdateSuccess={handleUpdateSuccess}
							insideModal={true}
						/>
					</View>

					<View style={styles.buttonBack}>
						<ButtonMenu
							type='round'
							text='Annuler'
							action={() => setMode('view')}
						/>
					</View>
				</View>
			)}

			{mode === 'delete' && (
				<View style={styles.deleteContainer}>
					<DeleteBlock
						selectedWorktime={selectedWorktime}
						onDeleteSuccess={handleDeleteSuccess}
						onCancel={() => setMode('view')}
						setModalVisible={setModalVisible}
						setWorktimes={setWorktimes}
						setSnackBar={setSnackBar}
					/>
				</View>
			)}

			{/* Affichage du snackbar si nécessaire */}
			{snackBarMessage && (
				<View
					style={[
						styles.snackbar,
						{
							backgroundColor:
								snackBarMessage.type === 'error'
									? colors.primary
									: colors.secondary,
						},
					]}
				>
					<ThemedText>{snackBarMessage.message}</ThemedText>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		padding: 5,
	},
	viewContainer: {
		width: '100%',
	},
	editContainer: {
		width: '100%',
	},
	deleteContainer: {
		width: '100%',
	},
	formContainer: {
		width: '100%',
	},
	header: {
		marginBottom: 10,
		width: '100%',
	},
	buttonsContainer: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		gap: 10,
		marginTop: 10,
		width: '100%',
		alignItems: 'center',
	},
	actionButton: {
		width: '80%',
		marginVertical: 5,
	},
	buttonBack: {
		marginTop: 10,
		alignItems: 'center',
		width: '100%',
	},
	snackbar: {
		position: 'absolute',
		bottom: 10,
		left: 10,
		right: 10,
		padding: 10,
		borderRadius: 5,
		alignItems: 'center',
	},
});
