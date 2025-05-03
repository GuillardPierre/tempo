import React, { useState } from 'react';
import { View, Pressable, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useThemeColors } from '../../hooks/useThemeColors';
import ThemedText from '../../components/utils/ThemedText';

type Props = {
	label?: string;
	value: Date;
	onChange: (date: Date) => void;
};

export default function TimePickerInput({ label, value, onChange }: Props) {
	const [show, setShow] = useState(false);
	const colors = useThemeColors();

	const onTimeChange = (_: any, selectedDate?: Date) => {
		setShow(false);
		if (selectedDate) {
			onChange(selectedDate);
		}
	};

	const formatTime = (date: Date) => {
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');

		return `${hours}:${minutes}`;
	};

	return (
		<View style={styles.container}>
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
						borderColor: '#8955FD',
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
					{formatTime(value)}
				</ThemedText>
			</Pressable>

			{show && (
				<DateTimePicker
					value={value}
					mode='time'
					is24Hour={true}
					onChange={onTimeChange}
					display={Platform.OS === 'ios' ? 'spinner' : 'default'}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '40%',
		marginBottom: 5,
		textAlign: 'center',
	},
	label: {
		fontSize: 16,
		fontWeight: 'bold',
		paddingLeft: 5,
	},
	input: {
		width: '100%',
		borderWidth: 3,
		borderStyle: 'solid',
		borderRadius: 4,
		padding: 10,
		fontSize: 18,
		fontWeight: 'bold',
		textAlign: 'center',
	},
});
