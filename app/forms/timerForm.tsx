import { Vibration, View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import ButtonMenu from '../components/ButtonMenu';
import TimePickerInput from './utils/TimePickerInput';
import RoundButton from '../components/utils/RoundButton';
import { Formik } from 'formik';
import { useThemeColors } from '../hooks/useThemeColors';
import { Pressable } from 'react-native';
import { createWorkTimeSchema } from '../schema/createWorkTime';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { Category, SelectedWorktime } from '../types/worktime';
import DropDownPicker from 'react-native-dropdown-picker';
import CreateCategoryButton from './utils/CreateCategoryButton';
import { useTimerForm } from './useTimerForm';

type TimerFormMode = 'chrono' | 'activity';

interface CategoryData {
	id: string | null;
	title: string;
}

interface Props {
	setSnackBar: (type: 'error' | 'info', message: string) => void;
	setTimerIsOpen: (isOpen: boolean) => void;
	setWorktimes?: (worktimes: any[] | ((prevWorktimes: any[]) => any[])) => void;
	categories?: Category[];
	setCategories?: (
		categories: Category[] | ((prevCategories: Category[]) => Category[])
	) => void;
	selectedWorktime?: SelectedWorktime | null;
	isEditing?: boolean;
	date: string;
	mode: TimerFormMode;
}

function formatLocalDateTime(date: Date) {
	const pad = (n: number) => n.toString().padStart(2, '0');
	return (
		date.getFullYear() +
		'-' +
		pad(date.getMonth() + 1) +
		'-' +
		pad(date.getDate()) +
		'T' +
		pad(date.getHours()) +
		':' +
		pad(date.getMinutes()) +
		':00'
	);
}

export default function TimerForm({
	setSnackBar,
	setTimerIsOpen,
	setWorktimes,
	categories = [],
	setCategories,
	selectedWorktime = null,
	isEditing = false,
	date,
	mode,
}: Props) {
	const colors = useThemeColors();

	const {
		selectedDays,
		setSelectedDays,
		open,
		setOpen,
		searchText,
		setSearchText,
		submitWorktime,
		handleCategoryCreated,
		getInitialValues,
		daysAreDisplayed,
	} = useTimerForm({
		setSnackBar,
		setTimerIsOpen,
		setWorktimes,
		setCategories,
		selectedWorktime,
		isEditing,
		date,
	});

	const weekdays = [
		{ label: 'Lun', value: 'MO' },
		{ label: 'Mar', value: 'TU' },
		{ label: 'Mer', value: 'WE' },
		{ label: 'Jeu', value: 'TH' },
		{ label: 'Ven', value: 'FR' },
		{ label: 'Sam', value: 'SA' },
		{ label: 'Dim', value: 'SU' },
	];

	useEffect(() => {
		if (selectedWorktime?.recurrence) {
			const byDayMatch = selectedWorktime.recurrence.match(/BYDAY=([^;]+)/);
			if (byDayMatch) setSelectedDays(byDayMatch[1].split(','));
		}
	}, [selectedWorktime]);

	return (
		<View style={{ zIndex: 9999 }}>
			<Formik
				initialValues={getInitialValues()}
				validationSchema={toFormikValidationSchema(createWorkTimeSchema())}
				onSubmit={(values) => {
					submitWorktime({
						...values,
						startTime: formatLocalDateTime(values.startTime),
						endTime:
							mode === 'activity' && values.endTime
								? formatLocalDateTime(values.endTime)
								: undefined,
						recurrence:
							mode === 'activity' && selectedDays.length
								? `FREQ=WEEKLY;BYDAY=${selectedDays.join(',')}`
								: undefined,
					});
				}}
			>
				{({ setFieldValue, values, handleSubmit, errors, touched }) => (
					<View style={styles.container}>
						<Text style={[styles.label, { color: colors.secondaryText }]}>
							Choisissez une activité :
						</Text>
						<DropDownPicker
							open={open}
							value={values.category.id}
							items={categories.map((c) => ({
								label: c.name,
								value: String(c.id),
							}))}
							setOpen={setOpen}
							setValue={(callback) => {
								const currentValue = callback(values.category.id);
								return currentValue;
							}}
							onSelectItem={(item) => {
								if (item && item.value) {
									const value = item.value.toString();
									const category = categories.find(
										(c) => String(c.id) === value
									);
									if (category) {
										setFieldValue('category', {
											id: value,
											title: category.name,
										});
									}
								}
							}}
							searchable={true}
							searchPlaceholder='Tapez pour rechercher ou créer une catégorie'
							onChangeSearchText={(text) => {
								setSearchText(text);
							}}
							placeholder='Sélectionnez une catégorie'
							style={[styles.dropdown, { borderColor: colors.primary }]}
							dropDownContainerStyle={[
								styles.dropdownContainer,
								{
									backgroundColor: colors.background,
									borderColor: colors.primary,
								},
							]}
							listMode='MODAL'
							modalAnimationType='slide'
							zIndex={10000}
							modalContentContainerStyle={[
								styles.modalContentContainer,
								{
									backgroundColor: colors.background,
									borderColor: colors.secondary,
								},
							]}
							ListEmptyComponent={(props) => (
								<CreateCategoryButton
									categoryName={searchText}
									onSuccess={(category) => {
										handleCategoryCreated(category);
									}}
								/>
							)}
						/>

						{touched.category?.title && errors.category?.title && (
							<Text style={[styles.errorText, { color: colors.primary }]}>
								{errors.category.title}
							</Text>
						)}

						{/* Sélecteurs de temps */}
						<View style={styles.timePickersContainer}>
							<View style={styles.timePickerContainer}>
								<TimePickerInput
									label='Début:'
									value={values.startTime}
									onChange={(date) => {
										setFieldValue('startTime', date);
										values.endTime &&
											date > values.endTime &&
											setFieldValue('endTime', date);
									}}
								/>
								{mode === 'chrono' && (
									<ButtonMenu
										fullWidth={false}
										style={{
											marginLeft: 10,
											alignSelf: 'flex-end',
											marginBottom: 10,
										}}
										type='round'
										text='Lancer Chronomètre'
										action={() => {
											Vibration.vibrate(50);
											handleSubmit();
										}}
									/>
								)}
							</View>
							{mode === 'activity' && (
								<View style={styles.timePickerContainer}>
									<TimePickerInput
										label='Fin:'
										value={
											values.endTime
												? values.endTime
												: new Date(date + 'T00:00:00')
										}
										onChange={(date) => setFieldValue('endTime', date)}
									/>
								</View>
							)}
						</View>

						{mode === 'activity' && daysAreDisplayed() && (
							<View style={styles.recurrenceContainer}>
								<Text style={styles.recurrenceLabel}>Répétition :</Text>
								<ScrollView
									style={styles.dayButtonsScroll}
									contentContainerStyle={styles.dayButtonsContainer}
									horizontal
									showsHorizontalScrollIndicator={false}
								>
									{weekdays.map((day) => (
										<Pressable
											key={day.value}
											style={[
												styles.dayButton,
												selectedDays.includes(day.value) && {
													backgroundColor: colors.secondary,
												},
											]}
											onPress={() =>
												setSelectedDays((prev) =>
													prev.includes(day.value)
														? prev.filter((d) => d !== day.value)
														: [...prev, day.value]
												)
											}
										>
											<Text
												style={[
													styles.dayButtonText,
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
							</View>
						)}

						{mode === 'activity' && (
							<ButtonMenu
								style={styles.submitButton}
								type='round'
								text={isEditing ? 'Mettre à jour' : "Enregistrer l'activité"}
								action={() => {
									Vibration.vibrate(50);
									handleSubmit();
								}}
							/>
						)}
					</View>
				)}
			</Formik>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	dropdown: {
		borderWidth: 3,
		borderRadius: 12,
		marginBottom: 10,
		width: '90%',
		marginLeft: 'auto',
		marginRight: 'auto',
	},
	dropdownContainer: {
		borderWidth: 3,
		borderRadius: 4,
	},
	modalContentContainer: {
		borderWidth: 3,
		borderRadius: 4,
		padding: 10,
		height: '50%',
		width: '100%',
		marginLeft: 'auto',
		marginRight: 'auto',
	},
	timePickersContainer: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'center',
		width: '90%',
		marginLeft: 'auto',
		marginRight: 'auto',
		gap: 20,
	},
	timePickerContainer: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		height: '100%',
		minHeight: 90,
	},
	roundButtonContainer: {
		flexDirection: 'row',
		marginTop: 15,
		marginLeft: 15,
		height: '100%',
		alignItems: 'center',
	},
	addEndTimeContainer: {
		flexDirection: 'row',
		width: '50%',
		height: '100%',
		alignItems: 'center',
		marginTop: 5,
		marginBottom: 20,
	},
	addEndTimeButton: {
		width: '100%',
		marginTop: 12,
	},
	recurrenceContainer: {
		marginVertical: 1,
		width: '100%',
	},
	recurrenceLabel: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 10,
		width: '90%',
		marginLeft: 'auto',
		marginRight: 'auto',
	},
	dayButtonsScroll: {
		width: '90%',
		marginLeft: 'auto',
		marginRight: 'auto',
		borderWidth: 2,
		borderColor: '#cccccc',
		borderRadius: 16,
		backgroundColor: '#f7f7f7',
		paddingVertical: 6,
	},
	dayButtonsContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		gap: 20,
		paddingHorizontal: 10,
	},
	dayButton: {
		width: 45,
		height: 45,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F0F0F0',
	},
	dayButtonText: {
		fontSize: 12,
		fontWeight: 'bold',
	},
	errorText: {
		fontSize: 12,
		marginBottom: 10,
		paddingLeft: 5,
	},
	label: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	submitButton: {
		width: '75%',
		marginTop: 10,
		marginLeft: 'auto',
		marginRight: 'auto',
	},
	arrowRight: {
		position: 'absolute',
		right: 10,
		top: '50%',
		transform: [{ translateY: -10 }],
		fontSize: 16,
		fontWeight: 'bold',
	},
});
