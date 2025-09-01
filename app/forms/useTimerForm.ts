import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { httpPost, httpPut } from '../components/utils/querySetup';
import ENDPOINTS from '../components/utils/ENDPOINT';
import {
	Category,
	SelectedWorktime,
	CreateRecurrenceRule,
	WorktimeSeries,
} from '../types/worktime';
import { parseRecurrenceRule } from '../utils/recurrence';

export function useTimerForm({
	setSnackBar,
	setTimerIsOpen,
	setWorktimes,
	setCategories,
	selectedWorktime = null,
	isEditing = false,
	date,
	mode,
	onChronoClose,
	setUnfinishedWorktimes,
}: {
	setSnackBar: (type: 'error' | 'info', message: string) => void;
	setTimerIsOpen: (isOpen: boolean) => void;
	setWorktimes?: (
		worktimes: any[] | ((prevWorktimes: any[]) => any[])
	) => void;
	setCategories?: (
		categories: Category[] | ((prevCategories: Category[]) => Category[])
	) => void;
	selectedWorktime?: SelectedWorktime | null;
	isEditing?: boolean;
	date: string;
	mode: 'chrono' | 'activity';
	onChronoClose?: () => void;
	setUnfinishedWorktimes?: (
		worktimes: WorktimeSeries[] | ((prevWorktimes: WorktimeSeries[]) => WorktimeSeries[])
	) => void;
}) {	
	const [selectedDays, setSelectedDays] = useState<string[]>([]);
	const [open, setOpen] = useState(false);
	const [searchText, setSearchText] = useState('');
	const [isRecurring, setIsRecurring] = useState(
		selectedWorktime?.recurrence ? true : false
	);

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
			const parsedDays = parseRecurrenceRule(selectedWorktime.recurrence);
			setSelectedDays(parsedDays);
		}
	}, [selectedWorktime]);

	// Mettre à jour isRecurring quand selectedWorktime change
	useEffect(() => {
		setIsRecurring(selectedWorktime?.recurrence ? true : false);
	}, [selectedWorktime]);

	const { mutate: submitWorktime, isPending } = useMutation({
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
			
			// Si c'est un chrono qui vient d'être lancé, notifier la fermeture
			if (mode === 'chrono' && !data.endHour && onChronoClose) {
				onChronoClose();
			}
			
			setTimerIsOpen(false);

			// Pour les chronos, toujours les ajouter à unfinishedWorktimes même si la date ne correspond pas
			if (mode === 'chrono' && !data.endHour && setUnfinishedWorktimes) {
				data.type = 'CHRONO';
				setUnfinishedWorktimes((prev) => [...prev, data]);
			}

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
				} else if (!data.endHour && mode !== 'chrono') {
					// Pour les activités non-chrono, les ajouter à la liste normale
					setWorktimes((prev) => [...prev, data]);
				} else if (data.endHour) {
					// Activités terminées
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

	const handleCategoryCreated = (category: Category) => {
		setCategories?.((prev) => [...prev, category]);
		setSnackBar('info', `Catégorie "${category.name}" créée`);
		setSearchText('');
	};

	// Fonction pour créer une nouvelle catégorie
	const createCategory = async (categoryName: string) => {
		try {
			const response = await httpPost(`${ENDPOINTS.category.create}`, {
				name: categoryName.trim(),
			});

			if (!response?.ok) {
				const errorMessage = await response?.text();
				setSnackBar('error', errorMessage || 'Échec de la création de la catégorie');
				return null;
			}

			const newCategory = await response.json();
			return newCategory;
		} catch (error) {
			console.error('Erreur lors de la création de la catégorie:', error);
			setSnackBar('error', 'Erreur lors de la création de la catégorie');
			return null;
		}
	};

	const getInitialValues = () => {
		// Créer une date locale pour éviter les problèmes de timezone
		const createUtcDate = (dateString: string, timeString: string = '02:00:00') => {
			const [year, month, day] = dateString.split('-').map(Number);
			const [hours, minutes, seconds] = timeString.split(':').map(Number);
			return new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
		  };
		  

		const initialValues = {
			category: selectedWorktime
				? {
						id: String(selectedWorktime.categoryId),
						title: selectedWorktime.categoryName || '',
				  }
				: { id: null, title: '' },
			startHour: selectedWorktime?.startHour
				? new Date(selectedWorktime.startHour)
				: (() => {
					const [year, month, day] = date.split('-').map(Number);
					const now = new Date();
					return new Date(
						year,
						month - 1,
						day,
						now.getHours(),
						now.getMinutes(),
						now.getSeconds()
					);
				})(),
			endHour: selectedWorktime?.endHour
				? new Date(selectedWorktime.endHour)
				: mode === 'chrono' ? null : (() => {
					const [year, month, day] = date.split('-').map(Number);
					const now = new Date();
					return new Date(
						year,
						month - 1,
						day,
						now.getHours(),
						now.getMinutes(),
						now.getSeconds()
					);
				})(),
			recurrence: undefined as CreateRecurrenceRule | undefined,
			startDate: selectedWorktime?.startDate
				? new Date(selectedWorktime.startDate)
				: createUtcDate(date),
			endDate: selectedWorktime?.endDate
				? new Date(selectedWorktime.endDate)
				: undefined,
			ignoreExceptions: selectedWorktime?.ignoreExceptions ? true : false,
		};
		return initialValues;
	};

	const daysAreDisplayed = () => {
		if (selectedWorktime && selectedWorktime.type === 'SINGLE')
			return false;
		if (selectedWorktime && selectedWorktime.type === 'RECURRING')
			return true;
		// Par défaut, afficher les jours pour les nouvelles activités
		return true;
	};

	return {
		selectedDays,
		setSelectedDays,
		open,
		setOpen,
		searchText,
		setSearchText,
		submitWorktime,
		isPending,
		handleCategoryCreated,
		createCategory,
		getInitialValues,
		daysAreDisplayed,
		weekdays,
		isRecurring,
		setIsRecurring,
	};
}
