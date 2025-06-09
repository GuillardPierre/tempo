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
	setWorktimes?: (worktimes: any[] | ((prevWorktimes: any[]) => any[])) => void;
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
			const byDayMatch = selectedWorktime.recurrence.match(/BYDAY=([^;]+)/);
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

			if (response && !response.ok) throw new Error(await response.text());
			if (response) return await response.json();
		},
		onSuccess: (data) => {
			setSnackBar(
				'info',
				!data.endTime
					? 'Temps de travail commencé. Bon travail !'
					: isEditing
					? 'Activité modifiée'
					: 'Temps enregistré'
			);
			setTimerIsOpen(false);
			if (setWorktimes) {
				if (isEditing && data.id) {
					setWorktimes((prev) =>
						prev.map((wt) => (wt.id === data.id ? data : wt))
					);
				} else if (!data.endTime) {
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
			startTime: selectedWorktime?.startTime
				? new Date(selectedWorktime.startTime)
				: new Date(date + 'T' + new Date().toTimeString().slice(0, 8)),
			endTime: selectedWorktime?.endTime
				? new Date(selectedWorktime.endTime)
				: undefined,
			recurrence: undefined as CreateRecurrenceRule | undefined,
			startDate: selectedWorktime?.startDate
				? new Date(selectedWorktime.startDate)
				: new Date(date + 'T00:00:00'),
			endDate: selectedWorktime?.endDate
				? new Date(selectedWorktime.endDate)
				: undefined,
		};
		return initialValues;
	};

	const daysAreDisplayed = () => {
		if (selectedWorktime && selectedWorktime.type === 'SINGLE') return false;
		if (selectedWorktime && selectedWorktime.type === 'RECURRING') return true;
		if (!selectedWorktime) return true;
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
