import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { httpPost, httpPut } from '../components/utils/querySetup';
import ENDPOINTS from '../components/utils/ENDPOINT';
import { formatLocalDateTime } from '../components/utils/utils';
import { formatRecurrenceRule, parseRecurrenceRule } from '../utils/recurrence';
import { Category, SelectedWorktime } from '../types/worktime';
import { Dimensions } from 'react-native';

type TimerFormMode = 'chrono' | 'activity';

interface UseTimerFormProps {
	setSnackBar: (type: 'error' | 'info', message: string) => void;
	setTimerIsOpen: (isOpen: boolean) => void;
	setWorktimes?: (
		worktimes: any[] | ((prevWorktimes: any[]) => any[])
	) => void;
	categories?: Category[];
	setCategories?: (
		categories: Category[] | ((prevCategories: Category[]) => Category[])
	) => void;
	selectedWorktime?: SelectedWorktime | null;
	isEditing?: boolean;
	date: string;
	mode: TimerFormMode;
}

export const useTimerForm = ({
	setSnackBar,
	setTimerIsOpen,
	setWorktimes,
	categories = [],
	setCategories,
	selectedWorktime = null,
	isEditing = false,
	date,
	mode,
}: UseTimerFormProps) => {
	const [selectedDays, setSelectedDays] = useState<string[]>([]);
	const [isRecurring, setIsRecurring] = useState(
		selectedWorktime?.recurrence ? true : false
	);

	// États locaux pour le dropdown et la recherche
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

	const screenWidth = Dimensions.get('window').width;

	// Initialiser les jours sélectionnés si on édite un worktime récurrent
	useEffect(() => {
		if (selectedWorktime?.recurrence) {
			const parsedDays = parseRecurrenceRule(selectedWorktime.recurrence);
			setSelectedDays(parsedDays);
		}
	}, [selectedWorktime]);

	// Mettre à jour isRecurring quand selectedDays change
	useEffect(() => {
		if (selectedDays.length > 0) {
			setIsRecurring(true);
		}
	}, [selectedDays]);

	// Validation de la date de début pour le mode chrono
	const validateChronoStartTime = (startTime: Date): boolean => {
		if (mode === 'chrono' && startTime > new Date()) {
			setSnackBar(
				'error',
				'Vous ne pouvez pas démarrer un chronomètre dans le futur. Veuillez choisir une date/heure valide.'
			);
			return false;
		}
		return true;
	};

	// Préparer les données pour la soumission
	const prepareFormData = (values: any) => ({
		...values,
		startHour: formatLocalDateTime(values.startHour),
		endHour: values.endHour ? formatLocalDateTime(values.endHour) : null,
		startDate: values.startDate ? formatLocalDateTime(values.startDate) : null,
		endDate: values.endDate ? formatLocalDateTime(values.endDate) : null,
		recurrence:
			mode === 'activity' && isRecurring && selectedDays.length > 0
				? formatRecurrenceRule(selectedDays)
				: undefined,
	});

	// Gérer la création d'une nouvelle catégorie
	const handleCategoryCreated = (newCategory: Category) => {
		if (setCategories) {
			setCategories((prev) => [...prev, newCategory]);
		}
		// Optionnel : fermer le dropdown et sélectionner la nouvelle catégorie
	};

	// Vérifier si les jours de récurrence sont affichés
	const daysAreDisplayed = (): boolean => {
		return !isEditing || mode === 'activity'  && selectedDays.length > 0;
	};

	// Mutation pour soumettre les worktimes
	const { mutate: submitWorktime, isPending } = useMutation({
		mutationFn: async (formData: any) => {
			const endpoint =
				isEditing && selectedWorktime?.id
					? selectedWorktime.type === 'RECURRING'
						? `${ENDPOINTS.worktimeSeries.root}${selectedWorktime.id}`
						: `${ENDPOINTS.worktime.root}${selectedWorktime.id}`
					: formData.recurrence
					? ENDPOINTS.worktimeSeries.create
					: ENDPOINTS.worktime.create;

			const method = isEditing ? httpPut : httpPost;
			const response = await method(endpoint, formData);
			if (response && !response.ok)
				throw new Error(await response.text());
			if (response) return await response.json();
		},
		onSuccess: (data) => {
			setSnackBar(
				'info',
				!data.endHour
					? 'Temps de travail commencé. Bon travail !'
					: isEditing
					? 'Activité modifiée'
					: 'Temps enregistré'
			);
			setTimerIsOpen(false);

			const shouldAddToFeed = (() => {
				if (!data.recurrence) {
					// Pour les worktime simples, vérifier si startHour correspond au jour actuel
					return data.startHour?.split('T')[0] === date;
				}

				if (data.recurrence && data.startDate) {
					// Pour les séries récurrentes
					const startDateOnly = data.startDate?.split('T')[0];
					const endDateOnly = data.endDate?.split('T')[0];
					const currentDate = date;
					const isAfterStart = currentDate >= startDateOnly;
					const isBeforeEnd =
						!endDateOnly || currentDate <= endDateOnly;

					if (isAfterStart && isBeforeEnd) {
						const byDayMatch =
							data.recurrence.match(/BYDAY=([^;]+)/);
						if (byDayMatch) {
							const recurrenceDays = byDayMatch[1].split(',');
							const dateObj = new Date(currentDate + 'T00:00:00');
							const dayOfWeek = dateObj.getDay();
							const dayToByDay = [
								'SU',
								'MO',
								'TU',
								'WE',
								'TH',
								'FR',
								'SA',
							];
							const currentDayByDay = dayToByDay[dayOfWeek];
							return recurrenceDays.includes(currentDayByDay);
						}
					}
				}
				return false;
			})();

			if (setWorktimes && shouldAddToFeed) {
				if (isEditing && data.id) {
					setWorktimes((prev) =>
						prev.map((wt) => (wt.id === data.id ? data : wt))
					);
				} else if (!data.endHour) {
					data.type = 'CHRONO';
					setWorktimes((prev) => [...prev, data]);
				} else {
					setWorktimes((prev) => [...prev, data]);
				}
			}
			if (setCategories && data.category)
				setCategories((prev) => [...prev, data.category]);
		},
		onError: (error: Error) => {
			console.error('error', error.message);
			setSnackBar('error', error.message || 'Erreur');
		},
	});

	// Gérer la soumission du formulaire
	const handleSubmit = (values: any) => {
		if (!validateChronoStartTime(values.startHour)) {
			return;
		}

		const formData = prepareFormData(values);
		
		// Appeler la mutation pour soumettre le worktime
		submitWorktime(formData);
	};

	// Gérer la sélection/désélection d'un jour
	const toggleDaySelection = (dayValue: string) => {
		setSelectedDays((prev) =>
			prev.includes(dayValue)
				? prev.filter((d) => d !== dayValue)
				: [...prev, dayValue]
		);
	};

	// Obtenir les valeurs initiales du formulaire
	const getInitialValues = () => {
		if (selectedWorktime) {
			return {
				category: {
					id: selectedWorktime.categoryId || '',
					title: selectedWorktime.categoryName || '',
				},
				startHour: selectedWorktime.startHour ? new Date(selectedWorktime.startHour) : new Date(),
				endHour: selectedWorktime.endHour ? new Date(selectedWorktime.endHour) : undefined,
				startDate: selectedWorktime.startDate ? new Date(selectedWorktime.startDate) : new Date(),
				endDate: selectedWorktime.endDate ? new Date(selectedWorktime.endDate) : undefined,
				ignoreExceptions: selectedWorktime.ignoreExceptions || false,
			};
		}

		return {
			category: { id: '', title: '' },
			startHour: new Date(),
			endHour: undefined,
			startDate: new Date(),
			endDate: undefined,
			ignoreExceptions: false,
		};
	};

	return {
		selectedDays,
		setSelectedDays,
		isRecurring,
		setIsRecurring,
		open,
		setOpen,
		searchText,
		setSearchText,
		weekdays,
		screenWidth,
		validateChronoStartTime,
		prepareFormData,
		handleCategoryCreated,
		daysAreDisplayed,
		handleSubmit,
		toggleDaySelection,
		getInitialValues,
		submitWorktime,
		isPending,
	};
};
