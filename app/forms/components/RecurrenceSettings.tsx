import React from 'react';
import { View, Text, Pressable, ScrollView, Vibration } from 'react-native';
import { Switch } from 'react-native-paper';
import { useThemeColors } from '../../hooks/useThemeColors';
import TimePickerInput from '../utils/TimePickerInput';
import BlockWrapper from '../../components/BlockWrapper';
import ThemedText from '../../components/utils/ThemedText';

interface RecurrenceSettingsProps {
	isRecurring: boolean;
	setIsRecurring: (value: boolean) => void;
	selectedDays: string[];
	setSelectedDays: React.Dispatch<React.SetStateAction<string[]>>;
	weekdays: Array<{ label: string; value: string }>;
	endDate?: Date;
	onEndDateChange: (date: Date) => void;
	ignoreExceptions: boolean;
	onIgnoreExceptionsChange: (value: boolean) => void;
	isEditing?: boolean;
}

export default function RecurrenceSettings({
	isRecurring,
	setIsRecurring,
	selectedDays,
	setSelectedDays,
	weekdays,
	endDate,
	onEndDateChange,
	ignoreExceptions,
	onIgnoreExceptionsChange,
	isEditing = false,
}: RecurrenceSettingsProps) {
	const colors = useThemeColors();

	return (
		<>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					width: '100%',
					justifyContent: 'center',
				}}
			>
				<Text
					style={{
						fontSize: 16,
						fontWeight: 'bold',
						marginBottom: 5,
						width: '70%',
					}}
				>
					Répétition sur plusieurs jours :
				</Text>
				<Switch
					value={isRecurring}
					onValueChange={setIsRecurring}
					disabled={selectedDays.length > 0}
				/>
			</View>
			{isRecurring && (
				<View
					style={{
						width: '100%',
					}}
				>
					<ScrollView
						style={{
							width: '100%',
							marginLeft: 'auto',
							marginRight: 'auto',
							borderWidth: 2,
							borderColor: '#cccccc',
							borderRadius: 16,
							backgroundColor: '#f7f7f7',
							paddingVertical: 6,
							minHeight: 70,
							marginBottom: 10,
						}}
						contentContainerStyle={{
							flexDirection: 'row',
							justifyContent: 'flex-start',
							alignItems: 'center',
							gap: 20,
							paddingHorizontal: 10,
						}}
						horizontal
						showsHorizontalScrollIndicator={false}
					>
						{weekdays.map((day) => (
							<Pressable
								key={day.value}
								style={[
									{
										width: 45,
										height: 45,
										borderRadius: 20,
										justifyContent: 'center',
										alignItems: 'center',
										backgroundColor: '#F0F0F0',
									},
									selectedDays.includes(day.value) && {
										backgroundColor: colors.secondary,
									},
								]}
								onPress={() => {
									Vibration.vibrate(50);
									setSelectedDays((prev) =>
										prev.includes(day.value)
											? prev.filter((d) => d !== day.value)
											: [...prev, day.value]
									);
								}}
							>
								<Text
									style={[
										{
											fontSize: 12,
											fontWeight: 'bold',
										},
										selectedDays.includes(day.value) && {
											color: 'white',
										},
									]}
								>
									{day.label}
								</Text>
							</Pressable>
						))}
					</ScrollView>

					<TimePickerInput
						label='Date de fin (non obligatoire):'
						value={endDate}
						onChange={(date) => {
							Vibration.vibrate(50);
							onEndDateChange(date);
						}}
						style={{ width: '100%' }}
						mode='date'
						display='calendar'
					/>
					<BlockWrapper style={{ minHeight: 80 }}>
						<ThemedText variant='body' color='secondaryText'>
							Vous voulez que vos temps de travail soient comptés
							même en vacances ? Activez l'option ci-dessous.
						</ThemedText>
					</BlockWrapper>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							marginBottom: isEditing ? 60 : 0,
						}}
					>
						<Switch
							value={ignoreExceptions}
							onValueChange={(value) => {
								Vibration.vibrate(50);
								onIgnoreExceptionsChange(value);
							}}
						/>
						<ThemedText variant='body' color='secondaryText'>
							Ignorer les périodes de pause ?
						</ThemedText>
					</View>
				</View>
			)}
		</>
	);
}
