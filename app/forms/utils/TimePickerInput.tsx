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
	display?: 'spinner' | 'calendar';
};

export default function TimePickerInput({
	label,
	value,
	onChange,
	style,
	mode = 'time',
	display = 'spinner',
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
				onChange(dateToUse);
			}
		}
		// Si annulé, ne rien faire
	};

	const formatTime = (date: Date) => {
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		return `${hours}:${minutes}`;
	};

	const formatDate = (date: Date) => {
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = date.getFullYear();
		return `${day}/${month}/${year}`;
	};
	return (
		<View style={[styles.container, style]}>
			{label && (
				<ThemedText style={[styles.label, { color: colors.secondaryText }]}>
					{label}
				</ThemedText>
			)}
			<Pressable
				onPress={() => setShow(true)}
				style={[
					styles.input,
					{
						backgroundColor: colors.primaryLight,
						borderColor: colors.primary,
					},
				]}
			>
				<ThemedText
					style={{
						color: colors.primaryText,
						textAlign: 'center',
						fontSize: 20,
						fontWeight: 'bold',
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
		marginBottom: 5,
		textAlign: 'center',
		width: 150,
	},
	label: {
		fontSize: 16,
		fontWeight: 'bold',
		paddingLeft: 5,
		marginBottom: 5,
	},
	input: {
		borderWidth: 4,
		borderStyle: 'solid',
		borderRadius: 12,
		padding: 10,
		fontSize: 18,
		fontWeight: 'bold',
		textAlign: 'center',
		height: 55,
	},
});
