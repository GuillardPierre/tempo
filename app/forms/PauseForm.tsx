import React from 'react';
import { View } from 'react-native';
import ThemedText from '../components/utils/ThemedText';
import { useThemeColors } from '../hooks/useThemeColors';
import { Formik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { recurrenceExceptionSchema } from '../schema/RecurrenceException';
import TimePickerInput from './utils/TimePickerInput';
import ButtonMenu from '../components/ButtonMenu';
import { httpDelete, httpPost, httpPut } from '../components/utils/querySetup';
import ENDPOINTS from '../components/utils/ENDPOINT';
import BlockWrapper from '../components/BlockWrapper';
import { RecurrenceException } from '../types/worktime';

interface Props {
	setSnackBar?: (type: 'error' | 'info', message: string) => void;
	setTimerIsOpen?: (open: boolean) => void;
	setModalVisible: (visible: boolean) => void;
	date?: string;
	setRecurrenceExceptions?: (
		recurrenceExceptions:
			| RecurrenceException[]
			| ((
					prevRecurrenceExceptions: RecurrenceException[]
			  ) => RecurrenceException[])
	) => void;
	recurrenceExceptions?: RecurrenceException[];
	selectedException?: RecurrenceException | null;
}

export default function PauseForm({
	setSnackBar,
	setTimerIsOpen,
	setModalVisible,
	date = new Date().toISOString().split('T')[0],
	setRecurrenceExceptions,
	recurrenceExceptions = [],
	selectedException = null,
}: Props) {
	const colors = useThemeColors();
	const isEditing = !!selectedException;

	const checkOverlap = (start: Date, end: Date): boolean => {
		return recurrenceExceptions.some((exception) => {
			// Ignorer l'exception en cours d'édition dans la vérification
			if (isEditing && exception.id === selectedException.id) {
				return false;
			}

			const exceptionStart = new Date(exception.pauseStart);
			const exceptionEnd = new Date(exception.pauseEnd);

			return (
				(start >= exceptionStart && start <= exceptionEnd) ||
				(end >= exceptionStart && end <= exceptionEnd) ||
				(start <= exceptionStart && end >= exceptionEnd)
			);
		});
	};

	const handleSubmit = async (values: any) => {
		// Vérifier les chevauchements
		if (checkOverlap(values.pauseStart, values.pauseEnd)) {
			setSnackBar?.('error', 'Cette période chevauche une pause existante');
			return;
		}

		try {
			const endpoint = isEditing
				? `${ENDPOINTS.recurrenceException.root}${selectedException.id}`
				: ENDPOINTS.recurrenceException.create;

			const method = isEditing ? httpPut : httpPost;
			const response = await method(endpoint, values);

			if (response?.status === (isEditing ? 200 : 201)) {
				const data = await response.json();

				setSnackBar?.(
					'info',
					isEditing ? 'Pause modifiée avec succès' : 'Pause ajoutée avec succès'
				);

				if (setRecurrenceExceptions) {
					setRecurrenceExceptions((prev) =>
						isEditing
							? prev?.map((exc) => (exc.id === data.id ? data : exc))
							: [...prev, data]
					);
				}

				setModalVisible(false);
				setTimerIsOpen?.(false);
			} else {
				setSnackBar?.(
					'error',
					isEditing
						? 'Erreur lors de la modification de la pause'
						: "Erreur lors de l'ajout de la pause"
				);
			}
		} catch (error) {
			console.log('error', error);
			setSnackBar?.(
				'error',
				isEditing
					? 'Erreur lors de la modification de la pause'
					: "Erreur lors de l'ajout de la pause"
			);
		}
	};

	const deleteException = async () => {
		try {
			const response = await httpDelete(
				`${ENDPOINTS.recurrenceException.root}${selectedException?.id}`
			);
			if (response?.status === 200) {
				setSnackBar?.('info', 'Pause supprimée avec succès');
				setRecurrenceExceptions?.((prev) =>
					prev.filter((exc) => exc.id !== selectedException?.id)
				);
				setModalVisible(false);
				setTimerIsOpen?.(false);
			}
		} catch (error) {
			console.log('error', error);
			setSnackBar?.('error', 'Erreur lors de la suppression de la pause');
		}
	};

	return (
		<View>
			{!isEditing && (
				<BlockWrapper style={{ height: 100, maxHeight: 100 }}>
					<ThemedText variant='body' color='secondaryText'>
						Les périodes de pause permettent de ne pas compter les temps de
						travail durant celle-ci (sauf si vous avez coché "inclure dans les
						périodes de vacances").
					</ThemedText>
				</BlockWrapper>
			)}
			<Formik
				initialValues={{
					pauseStart: selectedException
						? new Date(selectedException.pauseStart)
						: new Date(date + 'T00:00:00'),
					pauseEnd: selectedException
						? new Date(selectedException.pauseEnd)
						: new Date(date + 'T00:00:00'),
					seriesIds: selectedException?.seriesIds || [],
				}}
				validationSchema={toFormikValidationSchema(recurrenceExceptionSchema())}
				onSubmit={handleSubmit}
			>
				{({ setFieldValue, values, handleSubmit, errors, touched }) => (
					<>
						<View style={{ flexDirection: 'row', gap: 10 }}>
							<TimePickerInput
								mode='date'
								display='calendar'
								label='Date de début'
								value={values.pauseStart}
								onChange={(date) => setFieldValue('pauseStart', date)}
							/>
							<TimePickerInput
								mode='date'
								display='calendar'
								label='Date de fin'
								value={values.pauseEnd}
								onChange={(date) => setFieldValue('pauseEnd', date)}
							/>
						</View>
						<View
							style={{
								width: '50%',
								flexDirection: 'row',
								gap: 10,
							}}
						>
							<ButtonMenu
								text={isEditing ? 'Modifier' : 'Ajouter'}
								action={handleSubmit}
								type='round'
								style={{ marginTop: 10, width: '95%' }}
							/>
							<ButtonMenu
								text='Supprimer'
								action={deleteException}
								type='round'
								style={{
									marginTop: 10,
									width: '95%',
									backgroundColor: colors.error,
								}}
							/>
						</View>
					</>
				)}
			</Formik>
		</View>
	);
}
