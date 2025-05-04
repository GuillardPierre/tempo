import { Vibration, View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import ButtonMenu from '../components/ButtonMenu';
import TimePickerInput from './utils/TimePickerInput';
import RoundButton from '../components/utils/RoundButton';
import { Formik } from 'formik';
import { useMutation } from '@tanstack/react-query';
import { httpPost, httpPut } from '../components/utils/querySetup';
import ENDPOINTS from '../components/utils/ENDPOINT';
import { useThemeColors } from '../hooks/useThemeColors';
import { Pressable } from 'react-native';
import { createWorkTimeSchema } from '../schema/createWorkTime';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import {
	Category,
	CreateRecurrenceRule,
	SelectedWorktime,
} from '../types/worktime';
import DropDownPicker from 'react-native-dropdown-picker';
import CreateCategoryButton from './utils/CreateCategoryButton';

interface CategoryData {
	id: string | null;
	title: string;
}

type Props = {
	setSnackBar: (type: 'error' | 'info', message: string) => void;
	setTimerIsOpen: (isOpen: boolean) => void;
	setWorktimes?: (worktimes: any[] | ((prevWorktimes: any[]) => any[])) => void;
	categories?: Category[];
	setCategories?: (
		categories: Category[] | ((prevCategories: Category[]) => Category[])
	) => void;
	selectedWorktime?: SelectedWorktime | null;
	isEditing?: boolean;
	onUpdateSuccess?: () => void;
	insideModal?: boolean;
};

export default function TimerForm({
	setSnackBar,
	setTimerIsOpen,
	setWorktimes,
	categories = [],
	setCategories,
	selectedWorktime = null,
	isEditing = false,
	onUpdateSuccess,
	insideModal = false,
}: Props) {
	const colors = useThemeColors();
	const [endIsDefine, setEndIsDefine] = useState(!!selectedWorktime);
	const [selectedDays, setSelectedDays] = useState<string[]>([]);
	const [open, setOpen] = useState(false);
	const [searchText, setSearchText] = useState('');

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

	const { mutate: submitWorktime } = useMutation({
		mutationFn: async (formData: any) => {
			const endpoint =
				isEditing && selectedWorktime?.id
					? selectedWorktime.type === 'RECURRING'
						? `${ENDPOINTS.woktimeSeries.root}${selectedWorktime.id}`
						: `${ENDPOINTS.worktime.root}${selectedWorktime.id}`
					: formData.recurrence
					? ENDPOINTS.woktimeSeries.create
					: ENDPOINTS.worktime.create;

			const method = isEditing ? httpPut : httpPost;
			const response = await method(endpoint, formData);
			if (!response.ok) throw new Error(await response.text());

			return await response.json();
		},
		onSuccess: (data) => {
			console.log('Success:', data);

			setSnackBar('info', isEditing ? 'Activité modifiée' : 'Temps enregistré');
			setTimerIsOpen(false);
			if (setWorktimes) {
				if (isEditing && data.id) {
					setWorktimes((prev) =>
						prev.map((wt) => (wt.id === data.id ? data : wt))
					);
				} else {
					setWorktimes((prev) => [...prev, data]);
				}
			}
			if (setCategories && data.category)
				setCategories((prev) => [...prev, data.category]);
		},
		onError: (error: Error) => {
			setSnackBar('error', error.message || 'Erreur');
		},
	});

	const handleCategoryCreated = (category: Category) => {
		setCategories?.((prev) => [...prev, category]);
		setSnackBar('info', `Catégorie "${category.name}" créée`);
	};

	const getInitialValues = () => {
		const initialValues = {
			category: selectedWorktime
				? {
						id: String(selectedWorktime.categoryId),
						title: selectedWorktime.categoryName || '',
				  }
				: { id: null, title: '' },
			startTime: new Date(selectedWorktime?.startTime || Date.now()),
			endTime: new Date(selectedWorktime?.endTime || Date.now()),
			recurrence: undefined as CreateRecurrenceRule | undefined,
			startDate: selectedWorktime?.startDate
				? new Date(selectedWorktime.startDate)
				: new Date(),
		};
		return initialValues;
	};

	const daysAreDisplayed = () => {
		if (selectedWorktime && selectedWorktime.type === 'SINGLE') return false;
		if (selectedWorktime && selectedWorktime.type === 'RECURRING') return true;
		if (endIsDefine && !selectedWorktime) return true;
	};

	return (
		<View style={{ zIndex: 9999 }}>
			<Formik
				initialValues={getInitialValues()}
				validationSchema={toFormikValidationSchema(
					createWorkTimeSchema(endIsDefine)
				)}
				onSubmit={(values) => {
					submitWorktime({
						...values,
						startTime: values.startTime.toISOString(),
						endTime: values.endTime.toISOString(),
						recurrence: selectedDays.length
							? `FREQ=WEEKLY;BYDAY=${selectedDays.join(',')}`
							: undefined,
					});
				}}
			>
				{({ setFieldValue, values, handleSubmit, errors, touched }) => (
					<View style={[styles.container]}>
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
							searchPlaceholder='Rechercher...'
							onChangeSearchText={(text) => {
								setSearchText(text);
							}}
							placeholder='Sélectionnez une catégorie'
							style={{
								borderWidth: 3,
								borderColor: colors.primary,
								borderRadius: 4,
								marginBottom: 10,
							}}
							dropDownContainerStyle={{
								backgroundColor: colors.background,
								borderColor: colors.primary,
							}}
							listMode='MODAL'
							modalAnimationType='slide'
							zIndex={10000}
							modalContentContainerStyle={{
								backgroundColor: colors.background,
								borderColor: colors.secondary,
								borderWidth: 3,
								borderRadius: 4,
								padding: 10,
								height: '50%',
								width: '100%',
								margin: 'auto',
							}}
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
						<View style={[styles.timePickersContainer]}>
							<TimePickerInput
								label='Heure de début:'
								value={values.startTime}
								onChange={(date) => setFieldValue('startTime', date)}
							/>

							{endIsDefine ? (
								<View
									style={{
										flexDirection: 'row',
										width: '100%',
										height: '100%',
										alignItems: 'center',
										justifyContent: 'flex-start',
										gap: 5,
									}}
								>
									<TimePickerInput
										label='Heure de fin:'
										value={values.endTime}
										onChange={(date) => setFieldValue('endTime', date)}
									/>
									<View style={{ marginTop: 10 }}>
										<RoundButton
											variant='primary'
											type='close'
											svgSize={18}
											onPress={() => setEndIsDefine(false)}
										/>
									</View>
								</View>
							) : (
								<View
									style={{
										flexDirection: 'row',
										width: '50%',
										height: '100%',
										alignItems: 'center',
										marginTop: 5,
									}}
								>
									<ButtonMenu
										type='round'
										text='+ FIN'
										action={() => setEndIsDefine(true)}
									/>
								</View>
							)}
						</View>

						{daysAreDisplayed() && (
							<View style={styles.recurrenceContainer}>
								<Text style={styles.recurrenceLabel}>Répétition :</Text>
								<View style={styles.dayButtonsContainer}>
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
								</View>
							</View>
						)}

						{/* Bouton de soumission */}
						<ButtonMenu
							style={{ marginTop: 10 }}
							type='round'
							text={
								isEditing
									? 'Mettre à jour'
									: endIsDefine
									? "Enregistrer l'activité"
									: 'Lancer Chronomètre'
							}
							action={() => {
								Vibration.vibrate(50);
								handleSubmit();
							}}
						/>
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
	timePickersContainer: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		gap: 5,
		// marginVertical: 1,
		width: '100%',
	},
	recurrenceContainer: {
		marginVertical: 1,
		width: '100%',
	},
	recurrenceLabel: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	dayButtonsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: 5,
	},
	dayButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F0F0F0',
	},
	dayButtonText: {
		fontSize: 12,
		fontWeight: 'bold',
	},
	bigButton: {
		width: '100%',
		height: 50,
		marginTop: 20,
	},
	smallButton: {
		width: '70%',
		height: 40,
		marginTop: 10,
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
});
