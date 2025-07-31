import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { httpPost, httpPut } from '../components/utils/querySetup';
import ENDPOINTS from '../components/utils/ENDPOINT';
import {
	Category,
	SelectedWorktime,
	CreateRecurrenceRule,
} from '../types/worktime';

export function useTimerForm({
	setSnackBar,
	setTimerIsOpen,
	setWorktimes,
	setCategories,
	selectedWorktime = null,
	isEditing = false,
	date,
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
}) {
	const [selectedDays, setSelectedDays] = useState<string[]>([]);
	const [open, setOpen] = useState(false);
	const [searchText, setSearchText] = useState('');

	useEffect(() => {
		if (selectedWorktime?.recurrence) {
			const byDayMatch =
				selectedWorktime.recurrence.match(/BYDAY=([^;]+)/);
			if (byDayMatch) setSelectedDays(byDayMatch[1].split(','));
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
				!data.end
					? 'Temps de travail commencé. Bon travail !'
					: isEditing
					? 'Activité modifiée'
					: 'Temps enregistré'
			);
			setTimerIsOpen(false);

			const shouldAddToFeed = (() => {
				if (!data.recurrence) {
					return data.start?.split('T')[0] === date;
				}
				if (data.recurrence && data.start) {
					const startDateOnly = data.start?.split('T')[0];
					return startDateOnly === date;
				}
				return false;
			})();

			if (setWorktimes && shouldAddToFeed) {
				if (isEditing && data.id) {
					setWorktimes((prev) =>
						prev.map((wt) => (wt.id === data.id ? data : wt))
					);
				} else if (!data.end) {
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
			console.log('error', error.message);
			setSnackBar('error', error.message || 'Erreur');
		},
	});

	const handleCategoryCreated = (category: Category) => {
		setCategories?.((prev) => [...prev, category]);
		setSnackBar('info', `Catégorie "${category.name}" créée`);
	};

	const getInitialValues = () => {
		// Créer une date locale pour éviter les problèmes de timezone
		const createLocalDate = (
			dateString: string,
			timeString: string = '00:00:00'
		) => {
			const [year, month, day] = dateString.split('-').map(Number);
			const [hours, minutes, seconds] = timeString.split(':').map(Number);
			return new Date(year, month - 1, day, hours, minutes, seconds);
		};

		const initialValues = {
			category: selectedWorktime
				? {
						id: String(selectedWorktime.categoryId),
						title: selectedWorktime.categoryName || '',
				  }
				: { id: null, title: '' },
			start: selectedWorktime?.start
				? new Date(selectedWorktime.start)
				: createLocalDate(date, new Date().toTimeString().slice(0, 8)),
			end: selectedWorktime?.end
				? new Date(selectedWorktime.end)
				: undefined,
			recurrence: undefined as CreateRecurrenceRule | undefined,
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
