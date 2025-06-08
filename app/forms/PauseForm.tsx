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

interface Props {
	setSnackBar: (type: 'error' | 'info', message: string) => void;
	setTimerIsOpen: () => void;
	date: string;
}

export default function PauseForm({
	setSnackBar,
	setTimerIsOpen,
	date,
}: Props) {
	const colors = useThemeColors();

	const handleSubmit = async (values: any) => {
		try {
			const response = await httpPost(
				`${ENDPOINTS.recurrenceException.create}`,
				values
			);
			console.log('response', response);
			if (response?.status === 201) {
				setSnackBar('info', 'Pause ajoutée avec succès');
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
