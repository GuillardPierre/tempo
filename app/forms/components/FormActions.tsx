import React from 'react';
import { Vibration } from 'react-native';
import ButtonMenu from '../../components/ButtonMenu';

type TimerFormMode = 'chrono' | 'activity';

interface FormActionsProps {
	mode: TimerFormMode;
	isEditing?: boolean;
	startHour?: Date;
	endHour?: Date;
	onSubmit: () => void;
	setSnackBar: (type: 'error' | 'info', message: string) => void;
}

export default function FormActions({
	mode,
	isEditing = false,
	startHour,
	endHour,
	onSubmit,
	setSnackBar,
}: FormActionsProps) {
	if (mode !== 'activity') {
		return null;
	}

	return (
		<ButtonMenu
			style={{
				width: '100%',
			}}
			type='round'
			text={isEditing ? 'Mettre à jour' : "Enregistrer l'activité"}
			action={() => {
				Vibration.vibrate(50);

				if (startHour && endHour) {
					const startTime = startHour.getTime();
					const endTime = endHour.getTime();

					if (startTime === endTime) {
						setSnackBar(
							'error',
							"L'heure de début et de fin ne peuvent pas être identiques. Veuillez ajuster les heures."
						);
						return;
					}
				}

				onSubmit();
			}}
		/>
	);
}
