import React from 'react';
import { View, Vibration } from 'react-native';
import TimePickerInput from '../utils/TimePickerInput';
import ButtonMenu from '../../components/ButtonMenu';

type TimerFormMode = 'chrono' | 'activity';

interface DateTimeSelectorsProps {
	mode: TimerFormMode;
	selectedDays: string[];
	startDate: Date;
	startHour: Date;
	endHour?: Date | null;
	date: string;
	onDateChange: (date: Date) => void;
	onStartHourChange: (date: Date) => void;
	onEndHourChange: (date: Date) => void;
	onSubmit: () => void;
	setSnackBar: (type: 'error' | 'info', message: string) => void;
}

export default function DateTimeSelectors({
	mode,
	selectedDays,
	startDate,
	startHour,
	endHour,
	date,
	onDateChange,
	onStartHourChange,
	onEndHourChange,
	onSubmit,
	setSnackBar,
}: DateTimeSelectorsProps) {
	return (
		<>
			<TimePickerInput
				label={`${
					selectedDays.length > 0
						? 'Date de début'
						: "Date de l'activité"
				} :`}
				value={startDate}
				onChange={onDateChange}
				mode='date'
				display='calendar'
			/>

			<View
				style={{
					flexDirection: 'row',
					alignItems: 'flex-start',
					justifyContent: 'space-between',
					width: '100%',
					gap: 20,
				}}
			>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'flex-end',
					}}
				>
					<TimePickerInput
						label='Heure début:'
						value={startHour}
						onChange={(date) => {
							Vibration.vibrate(50);
							onStartHourChange(date);
							startHour &&
								date > startHour &&
								onEndHourChange(date);
						}}
					/>
					{mode === 'chrono' && (
						<ButtonMenu
							fullWidth={false}
							style={{
								transform: [{ translateY: 12 }],
								marginLeft: 10,
								alignSelf: 'flex-end',
								width: '50%',
							}}
							type='round'
							text='Lancer Chronomètre'
							action={() => {
								Vibration.vibrate(50);
								if (startHour > new Date()) {
									setSnackBar(
										'error',
										'Vous ne pouvez pas démarrer un chronomètre dans le futur. Veuillez choisir une date/heure valide.'
									);
									return;
								}
								onSubmit();
							}}
						/>
					)}
				</View>
				{mode === 'activity' && (
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'flex-end',
						}}
					>
						<TimePickerInput
							label='Heure fin:'
							value={
								endHour ||
								new Date(
									date +
										'T' +
										new Date().toTimeString().slice(0, 8)
								)
							}
							onChange={(date) => {
								Vibration.vibrate(50);
								onEndHourChange(date);
							}}
						/>
					</View>
				)}
			</View>
		</>
	);
}
