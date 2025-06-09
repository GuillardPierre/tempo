import React from 'react';
import { Button, View } from 'react-native';
import ThemedText from '../components/utils/ThemedText';
import { useThemeColors } from '../hooks/useThemeColors';
import { createWorkTimeSchema } from '../schema/createWorkTime';
import { Formik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { recurrenceExceptionSchema } from '../schema/RecurrenceException';
import TimePickerInput from './utils/TimePickerInput';
import ButtonMenu from '../components/ButtonMenu';
import { httpPost } from '../components/utils/querySetup';
import ENDPOINTS from '../components/utils/ENDPOINT';
import BlockWrapper from '../components/BlockWrapper';
import { RecurrenceException } from '../types/worktime';

interface Props {
	setSnackBar: (type: 'error' | 'info', message: string) => void;
	setTimerIsOpen: (open: boolean) => void;
	date: string;
	setRecurrenceExceptions: (
		recurrenceExceptions:
			| RecurrenceException[]
			| ((
					prevRecurrenceExceptions: RecurrenceException[]
			  ) => RecurrenceException[])
	) => void;
	recurrenceExceptions: RecurrenceException[];
}

export default function PauseForm({
	setSnackBar,
	setTimerIsOpen,
	date,
	setRecurrenceExceptions,
	recurrenceExceptions,
}: Props) {
	const colors = useThemeColors();

	const checkOverlap = (start: Date, end: Date): boolean => {
		return recurrenceExceptions.some((exception) => {
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
			setSnackBar('error', 'Cette période chevauche une pause existante');
			return;
		}

		try {
			const response = await httpPost(
				`${ENDPOINTS.recurrenceException.create}`,
				values
			);
			console.log('response', response);
			if (response?.status === 201) {
				const data = await response.json();
				console.log('data', data);

				setSnackBar('info', 'Pause ajoutée avec succès');
				setRecurrenceExceptions((prev) => [...prev, data]);
				setTimerIsOpen(false);
			} else {
				setSnackBar('error', "Erreur lors de l'ajout de la pause");
			}
		} catch (error) {
			console.log('error', error);
			setSnackBar('error', "Erreur lors de l'ajout de la pause");
		}
	};

	return (
		<View>
			<BlockWrapper style={{ height: 100, maxHeight: 100 }}>
				<ThemedText variant='body' color='secondaryText'>
					Les périodes de pause permettent de ne pas compter les temps de
					travail durant celle-ci (sauf si vous avez coché "inclure dans les
					périodes de vacances").
				</ThemedText>
			</BlockWrapper>
			<Formik
				initialValues={{
					pauseStart: new Date(date + 'T00:00:00'),
					pauseEnd: new Date(date + 'T00:00:00'),
				}}
				validationSchema={toFormikValidationSchema(recurrenceExceptionSchema())}
				onSubmit={handleSubmit}
			>
				{({ setFieldValue, values, handleSubmit, errors, touched }) => {
					return (
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
							<ButtonMenu
								text='Ajouter'
								action={handleSubmit}
								type='round'
								style={{ marginTop: 10, width: '95%' }}
							/>
						</>
					);
				}}
			</Formik>
		</View>
	);
}
