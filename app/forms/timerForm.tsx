import { Vibration, View, Text, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import CustomAutocomplete from './utils/CustomAutoComplete';
import ButtonMenu from '../components/ButtonMenu';
import TimePickerInput from './utils/TimePickerInput';
import { useState } from 'react';
import RoundButton from '../components/utils/RoundButton';
import { Formik } from 'formik';
import { useMutation } from '@tanstack/react-query';
import { httpPost } from '../components/utils/querySetup';
import ENDPOINTS from '../components/utils/ENDPOINT';
import { AutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';
import { useThemeColors } from '../hooks/useThemeColors';
import { Pressable } from 'react-native';
import { z } from 'zod';
import { createWorkTimeSchema } from '../schema/createWorkTime';
import { toFormikValidationSchema } from 'zod-formik-adapter';

interface ExtendedAutocompleteItem extends AutocompleteDropdownItem {
	realTitle?: string;
}

interface CategoryData {
	id: string | null;
	title: string;
}

interface BackendCategory {
	id: number;
	name: string;
}

interface RecurrenceRule {
	freq: string;
	byDay?: string[];
}

type Props = {
	setSnackBar: (type: 'error' | 'info', message: string) => void;
	setTimerIsOpen: (isOpen: boolean) => void;
	setWorktimes?: (worktimes: any[] | ((prevWorktimes: any[]) => any[])) => void;
	categories?: BackendCategory[];
	setCategories?: (
		categories:
			| BackendCategory[]
			| ((prevCategories: BackendCategory[]) => BackendCategory[])
	) => void;
};

export default function TimerForm({
	setSnackBar,
	setTimerIsOpen,
	setWorktimes,
	categories = [],
	setCategories,
}: Props) {
	const colors = useThemeColors();
	const [endIsDefine, setEndIsDefine] = useState(false);
	const [selectedDays, setSelectedDays] = useState<string[]>([]);
	const [autocompleteData, setAutocompleteData] = useState<CategoryData[]>([]);

	useEffect(() => {
		if (categories && categories.length > 0) {
			const formattedCategories: CategoryData[] = categories.map((cat) => ({
				id: String(cat.id), // Convertir l'id numérique en string
				title: cat.name,
			}));
			setAutocompleteData(formattedCategories);
		}
	}, [categories]);

	const handleCategoryCreated = (category: BackendCategory) => {
		if (setCategories) {
			setCategories([...categories, category]);
		}
		setSnackBar('info', `Catégorie "${category.name}" créée avec succès`);
	};

	const weekdays = [
		{ label: 'Lun', value: 'MO' },
		{ label: 'Mar', value: 'TU' },
		{ label: 'Mer', value: 'WE' },
		{ label: 'Jeu', value: 'TH' },
		{ label: 'Ven', value: 'FR' },
		{ label: 'Sam', value: 'SA' },
		{ label: 'Dim', value: 'SU' },
	];

	const formatISODate = (date: Date) => date.toISOString().slice(0, 16);

	const toggleDaySelection = (dayValue: string) => {
		setSelectedDays((prevSelectedDays) => {
			if (prevSelectedDays.includes(dayValue)) {
				// Si le jour est déjà sélectionné, le retirer
				return prevSelectedDays.filter((day) => day !== dayValue);
			} else {
				// Sinon, l'ajouter
				return [...prevSelectedDays, dayValue];
			}
		});
	};

	const buildRecurrenceRule = (): string | undefined => {
		if (selectedDays.length === 0) {
			return undefined;
		}

		return `FREQ=WEEKLY;BYDAY=${selectedDays.join(',')}`;
	};

	const { mutate: submitWorktime, isPending } = useMutation<any, Error, any>({
		mutationFn: async (formData) => {
			console.log('données worktime envoyées :', formData);
			let response;
			if (formData.recurrence !== undefined) {
				formData.startDate = formatISODate(new Date());
				response = await httpPost(
					`${ENDPOINTS.woktimeSeries.create}`,
					formData
				);
			} else {
				response = await httpPost(`${ENDPOINTS.worktime.create}`, formData);
			}

			if (!response.ok) {
				const errorMessage = await response.text();
				throw new Error(
					errorMessage || "Échec de l'enregistrement du chronomètre"
				);
			}

			const data = await response.json();
			return data;
		},
		onSuccess: (data: any) => {
			setSnackBar('info', 'Temps bien enregistré');
			setSelectedDays([]);
			setTimerIsOpen(false);
			// Si setWorktimes est défini, mettre à jour les worktimes après succès
			if (setWorktimes && data) {
				setWorktimes((prevData: any[]) => [...prevData, data]);
			}
			// Si une nouvelle catégorie a été créée et que setCategories est défini
			if (
				setCategories &&
				data.category &&
				!categories.find((cat) => cat.id === data.category.id)
			) {
				setCategories([...categories, data.category]);
			}
		},
		onError: (error: Error) => {
			console.error('Error submitting timer:', error);
			setSnackBar('error', 'Une erreur à eu lieu');
		},
	});

	// Fonction pour détecter si un ID correspond à une nouvelle catégorie
	const isNewCategory = (id: string | null): boolean => {
		if (!id) return false;
		return id === 'new-category' || id.startsWith('new-');
	};

	return (
		<View>
			<Formik
				initialValues={{
					category: { id: null, title: '' },
					startTime: new Date(),
					endTime: new Date(),
					recurrence: undefined as RecurrenceRule | undefined,
					startDate: undefined as undefined | Date, // New date seulement si récurrence
				}}
				onSubmit={(values) => {
					const formattedStartTime = formatISODate(values.startTime);
					const formattedEndTime = formatISODate(values.endTime);

					// Assurer que les nouvelles catégories ont bien un ID null
					const submissionValues = {
						...values,
						startTime: formattedStartTime,
						endTime: formattedEndTime,
						category: {
							...values.category,
							id: isNewCategory(values.category.id) ? null : values.category.id,
						},
						recurrence: buildRecurrenceRule(),
					};
					submitWorktime(submissionValues);
					console.log('Valeurs soumises:', submissionValues);
				}}
				validationSchema={() =>
					toFormikValidationSchema(createWorkTimeSchema(endIsDefine))
				}
			>
				{({
					handleChange,
					setFieldValue,
					handleBlur,
					handleSubmit,
					values,
					errors,
					touched,
				}) => (
					<View
						style={{
							height: '100%',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'flex-start',
						}}
					>
						<CustomAutocomplete
							label='Choisissez une activité :'
							initialData={autocompleteData}
							onSelectItem={(item: ExtendedAutocompleteItem | null) => {
								if (item) {
									// Si c'est une nouvelle catégorie avec realTitle, utiliser cette valeur
									const title =
										isNewCategory(item.id) && item.realTitle
											? item.realTitle
											: item.title;

									// Mettre à jour l'objet category au lieu d'une simple chaîne
									setFieldValue('category', {
										id: isNewCategory(item.id) ? null : item.id,
										title: title,
									});
								}
							}}
							onChange={(text) => {
								// Mettre à jour uniquement le titre si l'utilisateur tape sans sélectionner
								setFieldValue('category', {
									...values.category,
									title: text,
								});
							}}
							onCategoryCreated={handleCategoryCreated}
						/>
						{touched.category &&
							errors.category &&
							typeof errors.category === 'object' &&
							errors.category.title && (
								<Text
									style={[styles.errorText, { color: colors.primary || 'red' }]}
								>
									{errors.category.title}
								</Text>
							)}
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'flex-start',
								gap: 10,
							}}
						>
							<View style={{ width: '40%' }}>
								<TimePickerInput
									label='heure de début:'
									value={values.startTime}
									onChange={(date) => {
										setFieldValue('startTime', date);
									}}
								/>
							</View>
							<View style={{ width: '40%' }}>
								{endIsDefine ? (
									<View
										style={{
											display: 'flex',
											flexDirection: 'row',
											alignItems: 'center',
											gap: 20,
										}}
									>
										<View style={{ width: '100%' }}>
											<TimePickerInput
												label='heure de fin:'
												value={values.endTime}
												onChange={(date) => {
													setFieldValue('endTime', date);
												}}
											/>
											{touched.endTime && errors.endTime && (
												<Text
													style={[
														styles.errorText,
														{ color: colors.primary || 'red' },
													]}
												>
													{errors.endTime as string}
												</Text>
											)}
										</View>
										<View style={{ width: '10%' }}>
											<RoundButton
												svgSize={18}
												btnSize={40}
												variant='primary'
												type='close'
												onPress={() => {
													Vibration.vibrate(50);
													setEndIsDefine(!endIsDefine);
												}}
											></RoundButton>
										</View>
									</View>
								) : (
									<View style={{ width: '100%' }}>
										<ButtonMenu
											type='round'
											text='+ heure de fin'
											action={() => {
												Vibration.vibrate(50);
												setEndIsDefine(!endIsDefine);
											}}
										/>
									</View>
								)}
							</View>
						</View>

						{endIsDefine && (
							<View style={styles.recurrenceContainer}>
								<Text style={styles.recurrenceLabel}>Récurrence:</Text>
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
											onPress={() => {
												Vibration.vibrate(50);
												toggleDaySelection(day.value);
											}}
										>
											<Text
												style={[
													styles.dayButtonText,
													selectedDays.includes(day.value) && {
														color: '#FFFFFF',
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

						<View style={endIsDefine ? styles.smallButton : styles.bigButton}>
							<ButtonMenu
								type='round'
								text={
									endIsDefine ? "Enregistrer l'activité" : 'Lancer Chronomètre'
								}
								action={() => {
									Vibration.vibrate(50);
									endIsDefine ? handleSubmit() : null;
								}}
							/>
						</View>
					</View>
				)}
			</Formik>
		</View>
	);
}

const styles = StyleSheet.create({
	recurrenceContainer: {
		marginBottom: 5,
	},
	recurrenceLabel: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 0,
	},
	dayButtonsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexWrap: 'wrap',
	},
	dayButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F0F0F0',
		margin: 4,
	},
	dayButtonText: {
		fontSize: 12,
		fontWeight: 'bold',
	},
	bigButton: {
		height: 50,
		marginInline: 'auto',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
	},
	smallButton: {
		marginTop: 3,
		height: 40,
		width: '70%',
		marginInline: 'auto',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	errorText: {
		fontSize: 12,
		marginTop: 2,
		marginBottom: 5,
		paddingLeft: 5,
	},
});
