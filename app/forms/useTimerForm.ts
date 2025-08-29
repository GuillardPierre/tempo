import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { httpPost, httpPut } from '../components/utils/querySetup';
import ENDPOINTS from '../components/utils/ENDPOINT';
import {
	Category,
	SelectedWorktime,
	CreateRecurrenceRule,
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
}) {	
	const [selectedDays, setSelectedDays] = useState<string[]>([]);
	const [open, setOpen] = useState(false);
	const [searchText, setSearchText] = useState('');

	useEffect(() => {
		if (selectedWorktime?.recurrence) {
			const parsedDays = parseRecurrenceRule(selectedWorktime.recurrence);
			setSelectedDays(parsedDays);
		}
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

	const handleCategoryCreated = (category: Category) => {
		setCategories?.((prev) => [...prev, category]);
		setSnackBar('info', `Catégorie "${category.name}" créée`);
	};

	const getInitialValues = () => {
		// Créer une date locale pour éviter les problèmes de timezone
		const createUtcDate = (dateString: string, timeString: string = '00:00:00') => {
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
				: mode === 'chrono'
				? createUtcDate(new Date().toISOString().split('T')[0] + "Z") 
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
		getInitialValues,
		daysAreDisplayed,
	};
}
