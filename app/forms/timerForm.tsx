import { Vibration, View, Text, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import ButtonMenu from '../components/ButtonMenu';
import TimePickerInput from './utils/TimePickerInput';
import { useState } from 'react';
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
	insideModal?: boolean; // Nouvelle propriété pour indiquer si le TimerForm est utilisé dans une modale
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
	insideModal = false, // Valeur par défaut à false
}: Props) {
	const colors = useThemeColors();
	const [endIsDefine, setEndIsDefine] = useState(
		selectedWorktime ? true : false
	);
	const [selectedDays, setSelectedDays] = useState<string[]>([]);
	const [autocompleteData, setAutocompleteData] = useState<CategoryData[]>([]);

	// États pour DropDownPicker
	const [open, setOpen] = useState(false);
	const [categoryValue, setCategoryValue] = useState<string | null>(
		selectedWorktime ? String(selectedWorktime.categoryId) : null
	);
	const [dropdownItems, setDropdownItems] = useState<any[]>([]);
	const [inputValue, setInputValue] = useState(
		selectedWorktime ? selectedWorktime.categoryName || '' : ''
	);
	const [showCreateButton, setShowCreateButton] = useState(false);

	// Extraire les jours de récurrence si disponibles
	useEffect(() => {
		if (selectedWorktime?.recurrence) {
			const recurrenceString = selectedWorktime.recurrence;
			const byDayMatch = recurrenceString.match(/BYDAY=([^;]+)/);
			if (byDayMatch && byDayMatch[1]) {
				setSelectedDays(byDayMatch[1].split(','));
			}
		}
	}, [selectedWorktime]);

	// Convertir les catégories en format pour DropDownPicker
	useEffect(() => {
		if (categories && categories.length > 0) {
			const formattedCategories: CategoryData[] = categories.map((cat) => ({
				id: String(cat.id),
				title: cat.name,
			}));
			setAutocompleteData(formattedCategories);

			// Préparer les éléments pour le DropDownPicker
			const dropdownItems = categories.map((cat) => ({
				label: cat.name,
				value: String(cat.id),
			}));
			setDropdownItems(dropdownItems);

			// Si on est en mode édition, définir la valeur initiale
			if (selectedWorktime) {
				setCategoryValue(String(selectedWorktime.categoryId));
			}
		}
	}, [categories, selectedWorktime]);

	const handleCategoryCreated = (category: Category) => {
		if (setCategories) {
			setCategories([...categories, category]);
			setDropdownItems((prev) => [
				...prev,
				{ label: category.name, value: String(category.id) },
			]);

			// Sélectionner la nouvelle catégorie
			setCategoryValue(String(category.id));
			setInputValue(category.name);
			setShowCreateButton(false);
		}
		setSnackBar('info', `Catégorie "${category.name}" créée avec succès`);
	};

	// Gérer le changement de texte dans le dropdown
	const handleCategoryTextChange = (text: string) => {
		setInputValue(text);
		const categoryExists = categories.some(
			(cat) => cat.name.toLowerCase() === text.toLowerCase()
		);
		setShowCreateButton(!categoryExists && text.length > 0);
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

	const getInitialValues = () => {
		if (isEditing && selectedWorktime) {
			return {
				category: {
					id: String(selectedWorktime.categoryId),
					title: selectedWorktime.categoryName || '',
				},
				startTime: new Date(selectedWorktime.startTime || ''),
				endTime: new Date(selectedWorktime.endTime || ''),
				recurrence: selectedWorktime.recurrence
					? ({ freq: 'WEEKLY' } as CreateRecurrenceRule)
					: undefined,
				startDate: selectedWorktime.startDate
					? new Date(selectedWorktime.startDate)
					: undefined,
			};
		}
		return {
			category: { id: null, title: '' },
			startTime: new Date(),
			endTime: new Date(),
			recurrence: undefined as CreateRecurrenceRule | undefined,
			startDate: undefined as undefined | Date,
		};
	};

	const { mutate: submitWorktime, isPending } = useMutation<any, Error, any>({
		mutationFn: async (formData) => {
			console.log('données worktime envoyées :', formData);
			let response;

			if (isEditing && selectedWorktime) {
				// Modification d'un worktime existant
				const endpoint = selectedWorktime.isRecurring
					? `${ENDPOINTS.woktimeSeries.root}/${selectedWorktime.id}`
					: `${ENDPOINTS.worktime.root}/${selectedWorktime.id}`;

				response = await httpPut(endpoint, formData);
			} else {
				// Création d'un nouveau worktime
				if (formData.recurrence !== undefined) {
					formData.startDate = formatISODate(new Date());
					response = await httpPost(
						`${ENDPOINTS.woktimeSeries.create}`,
						formData
					);
				} else {
					response = await httpPost(`${ENDPOINTS.worktime.create}`, formData);
				}
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
			if (isEditing) {
				setSnackBar('info', 'Activité modifiée avec succès');
				if (onUpdateSuccess) onUpdateSuccess();
			} else {
				setSnackBar('info', 'Temps bien enregistré');
				// Si setWorktimes est défini, mettre à jour les worktimes après succès
				if (setWorktimes && data) {
					setWorktimes((prevData: any[]) => [...prevData, data]);
				}
			}

			setSelectedDays([]);
			setTimerIsOpen(false);

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

	const isNewCategory = (id: string | null): boolean => {
		if (!id) return false;
		return id === 'new-category' || id.startsWith('new-');
	};

	return (
		<View>
			<Formik
				initialValues={getInitialValues()}
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
				enableReinitialize={true}
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
							height: 'auto',
							width: '100%',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'flex-start',
							zIndex: 9999,
						}}
					>
						<Text style={[styles.label, { color: colors.secondaryText }]}>
							Choisissez une activité :
						</Text>
						<DropDownPicker
							open={open}
							value={categoryValue}
							items={dropdownItems}
							setOpen={setOpen}
							dropDownDirection='TOP'
							zIndex={10000}
							zIndexInverse={10000}
							modalProps={{
								animationType: 'fade',
							}}
							modalContentContainerStyle={{
								backgroundColor: colors.primaryLight,
							}}
							modalTitle='Choisir une catégorie'
							setValue={(value) => {
								setCategoryValue(value);
								// Trouver le label correspondant à la valeur sélectionnée
								const selectedItem = dropdownItems.find(
									(item) => item.value === value
								);
								// Mettre à jour les valeurs du formulaire
								setFieldValue('category', {
									id: value,
									title: selectedItem ? selectedItem.label : inputValue,
								});
							}}
							setItems={setDropdownItems}
							searchable={true}
							placeholder='Classe, Préparation, Correction, ...'
							searchPlaceholder='Rechercher ou créez une catégorie'
							onChangeSearchText={handleCategoryTextChange}
							style={{
								borderWidth: 3,
								borderColor: colors.primary,
								borderRadius: 4,
								marginBottom: 10,
							}}
							searchContainerStyle={{
								borderBottomColor: colors.secondary,
							}}
						/>

						{showCreateButton && (
							<CreateCategoryButton
								categoryName={inputValue}
								onSuccess={handleCategoryCreated}
							/>
						)}

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
	label: {
		fontSize: 16,
		fontWeight: 'bold',
		paddingLeft: 5,
		marginBottom: 5,
	},
});
