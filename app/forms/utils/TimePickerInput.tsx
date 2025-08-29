import React, { useState } from 'react';
import { View, Pressable, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useThemeColors } from '../../hooks/useThemeColors';
import ThemedText from '../../components/utils/ThemedText';
import { StyleProp, ViewStyle } from 'react-native';

type Props = {
	label?: string;
	value?: Date;
	onChange: (date: Date) => void;
	style?: StyleProp<ViewStyle>;
	mode?: 'time' | 'date';
	display?: 'default' | 'calendar';
	disabled?: boolean;
};

export default function TimePickerInput({
	label,
	value,
	onChange,
	style,
	mode = 'time',
	display = 'default',
	disabled = false,
}: Props) {
	const [show, setShow] = useState(false);
	const colors = useThemeColors();

	const onTimeChange = (event: any, selectedDate?: Date) => {
		setShow(false);
		if (event.type === 'set') {
			const dateToUse =
				selectedDate ??
				(event.nativeEvent && event.nativeEvent.timestamp
					? new Date(event.nativeEvent.timestamp)
					: undefined);
			if (dateToUse) {
				if (mode === 'date') {
					// Créer une date locale en utilisant les méthodes UTC pour éviter les décalages
					const year = dateToUse.getFullYear();
					const month = dateToUse.getMonth();
					const day = dateToUse.getDate();

					// Créer une date en utilisant UTC pour éviter les conversions de timezone
					const utcDate = new Date(
						Date.UTC(year, month, day, 0, 0, 0)
					);
					onChange(utcDate);
				} else {
					onChange(dateToUse);
				}
			}
		}
	};

	const formatTime = (date: Date) => {
		// Pour les heures, utiliser les méthodes locales
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		return `${hours}:${minutes}`;
	};

	const formatDate = (date: Date) => {
		// Pour les dates, utiliser les méthodes UTC pour l'affichage
		const day = String(date.getUTCDate()).padStart(2, '0');
		const month = String(date.getUTCMonth() + 1).padStart(2, '0');
		const year = date.getUTCFullYear();
		return `${day}/${month}/${year}`;
	};
	return (
		<View style={[styles.container, style]}>
			{label && (
				<ThemedText
					style={[styles.label, { color: colors.secondaryText }]}
				>
					{label}
				</ThemedText>
			)}
			<Pressable
				onPress={() => !disabled && setShow(true)}
				style={[
					styles.input,
					{
						borderColor: colors.primary,
					},
				]}
			>
				<ThemedText
					style={{
						color: colors.secondaryText,
						textAlign: 'center',
						fontSize: 16,
						fontWeight: 500,
					}}
				>
					{value
						? mode === 'time'
							? formatTime(value)
							: formatDate(value)
						: mode === 'date'
						? 'Sélectionner une date'
						: 'Sélectionner une heure'}
				</ThemedText>
			</Pressable>

			{show && (
				<DateTimePicker
					value={value ?? new Date()}
					mode={mode}
					is24Hour={true}
					onChange={onTimeChange}
					display={display}
					{...(Platform.OS === 'ios' ? { locale: 'fr-FR' } : {})}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		textAlign: 'center',
		width: 150,
	},
	label: {
		fontSize: 14,
		paddingLeft: 8,
		marginBottom: 1,
		marginTop: 3
	},
	input: {
		borderWidth: 3,
		borderStyle: 'solid',
		borderRadius: 12,
		padding: 10,
		fontSize: 16,
		textAlign: 'center',
	},
});
