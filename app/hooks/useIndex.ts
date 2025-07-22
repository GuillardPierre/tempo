import { useEffect, useState } from 'react';
import { httpGet, checkAndRefreshToken } from '../components/utils/querySetup';
import ENDPOINTS from '../components/utils/ENDPOINT';
import {
	Category,
	RecurrenceException,
	Worktime,
	WorktimeSeries,
	WorktimeByDay,
} from '../types/worktime';
import { useRouter } from 'expo-router';
import useSnackBar from '@/app/hooks/useSnackBar';

export const useIndex = () => {
	const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
	const [month, setMonth] = useState(new Date(date));
	const [selectedWorktime, setSelectedWorktime] =
		useState<WorktimeSeries | null>(null);
	const [worktimesByDay, setWorktimesByDay] = useState<WorktimeByDay>({
		yesterday: [],
		today: [],
		tomorrow: [],
	});
	const [categories, setCategories] = useState<Category[]>([]);
	const [monthWorktimes, setMonthWorktimes] = useState<Worktime[]>([]);
	const [recurrenceExceptions, setRecurrenceExceptions] = useState<
		RecurrenceException[]
	>([]);
	const [unfinishedWorktimes, setUnfinishedWorktimes] = useState<
		WorktimeSeries[]
	>([]);
	const [selectedException, setSelectedException] =
		useState<RecurrenceException | null>(null);
	const router = useRouter();
	const { color, open, message, setOpen, setSnackBar } = useSnackBar();

	// Computed property pour accéder facilement aux worktimes du jour
	const worktimes = worktimesByDay.today;

	// Fonction wrapper pour maintenir la compatibilité avec les composants existants
	const setWorktimes = (
		updater:
			| WorktimeSeries[]
			| ((prev: WorktimeSeries[]) => WorktimeSeries[])
	) => {
		setWorktimesByDay((prev) => {
			const newToday =
				typeof updater === 'function' ? updater(prev.today) : updater;
			return {
				...prev,
				today: newToday,
			};
		});
	};

	useEffect(() => {
		getCategrories();
		getMonthWorktimes();
		getRecurrenceExceptions();
		getWorktimes();
	}, []);

	useEffect(() => {
		getMonthWorktimes();
		// Mise à jour des worktimes non terminés basée sur tous les worktimes
		if (worktimesByDay) {
			const allWorktimes = [
				...(worktimesByDay.yesterday || []),
				...(worktimesByDay.today || []),
				...(worktimesByDay.tomorrow || []),
			];
			setUnfinishedWorktimes(
				allWorktimes.filter((worktime) => worktime.endTime === null)
			);
		}
	}, [worktimesByDay, month]);

	useEffect(() => {
		getWorktimes();
	}, [date]);

	useEffect(() => {
		async function verifyToken() {
			try {
				const isValid = await checkAndRefreshToken();
				if (!isValid) {
					setSnackBar('error', 'Vous avez été déconnecté');
					router.replace('/screens/auth/Login');
				}
			} catch (error) {
				console.error(
					'Erreur lors de la vérification du token:',
					error
				);
			}
		}
		verifyToken();
	}, []);

	const getMonthWorktimes = async () => {
		try {
			const rep = await httpGet(`${ENDPOINTS.schedule.month}${date}`);
			if (rep.ok) {
				const data = await rep.json();
				if (data.length === 0) {
					setMonthWorktimes([]);
				} else {
					setMonthWorktimes(data);
				}
			}
		} catch (error) {
			console.error('Erreur getMonthWorktimes:', error);
		}
	};

	console.log('worktimes', worktimes);

	const getWorktimes = async () => {
		try {
			const rep = await httpGet(`${ENDPOINTS.schedule.day}${date}`);
			if (rep.ok) {
				const data = await rep.json();
				console.log('data', data);
				setWorktimesByDay(
					data || {
						yesterday: [],
						today: [],
						tomorrow: [],
					}
				);
			} else {
				console.error('Erreur getWorktimes: réponse non ok');
				setWorktimesByDay({
					yesterday: [],
					today: [],
					tomorrow: [],
				});
			}
		} catch (error) {
			console.error('Erreur getWorktimes:', error);
			setWorktimesByDay({
				yesterday: [],
				today: [],
				tomorrow: [],
			});
		}
	};

	const getCategrories = async () => {
		try {
			const rep = await httpGet(`${ENDPOINTS.category.root}all`);
			if (rep.ok) {
				const data = await rep.json();
				setCategories(data);
			}
		} catch (error) {
			console.error('Erreur getCategrories:', error);
		}
	};

	const getRecurrenceExceptions = async () => {
		try {
			const rep = await httpGet(
				`${ENDPOINTS.recurrenceException.root}all`
			);
			if (rep.ok) {
				const data = await rep.json();
				setRecurrenceExceptions(data);
			}
		} catch (error) {
			console.error('Erreur getRecurrenceExceptions:', error);
		}
	};

	return {
		worktimes,
		worktimesByDay,
		monthWorktimes,
		recurrenceExceptions,
		unfinishedWorktimes,
		categories,
		date,
		setDate,
		month,
		setMonth,
		setWorktimes,
		setWorktimesByDay,
		setRecurrenceExceptions,
		setCategories,
		selectedWorktime,
		setSelectedWorktime,
		setUnfinishedWorktimes,
		color,
		open,
		message,
		setOpen,
		setSnackBar,
		selectedException,
		setSelectedException,
	};
};
