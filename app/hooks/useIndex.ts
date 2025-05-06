import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { httpGet } from '../components/utils/querySetup';
import ENDPOINTS from '../components/utils/ENDPOINT';
import { Category, Worktime } from '../types/worktime';

export const useIndex = () => {
	const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
	const [month, setMonth] = useState(new Date(date));
	const [modalVisible, setModalVisible] = useState(false);
	const [modalType, setModalType] = useState<'menu' | 'update'>('menu');
	const [timerIsOpen, setTimerIsOpen] = useState(false);
	const [calendarIsOpen, setCalendarIsOpen] = useState(false);
	const [isConnected, setIsConnected] = useState<boolean | null>(null);
	const [selectedWorktime, setSelectedWorktime] = useState<Worktime | null>(
		null
	);
	const [worktimes, setWorktimes] = useState<Worktime[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [monthWorktimes, setMonthWorktimes] = useState<Worktime[]>([]);
	const [unfinishedWorktimes, setUnfinishedWorktimes] = useState<Worktime[]>(
		[]
	);

	// console.log('Worktimes', worktimes);
	// console.log('Unfinished Worktimes', unfinishedWorktimes);

	useEffect(() => {
		checkConnection();
		getCategrories();
		getMonthWorktimes();
	}, []);

	useEffect(() => {
		getMonthWorktimes();
		setUnfinishedWorktimes(
			worktimes.filter((worktime) => worktime.endTime === null)
		);
	}, [worktimes, month]);

	useEffect(() => {
		if (isConnected) {
			getWorktimes();
		}
	}, [date]);

	async function checkConnection() {
		const value = await AsyncStorage.getItem('token');
		if (value) {
			setIsConnected(true);
			getWorktimes();
		} else {
			setIsConnected(false);
		}
	}

	const getMonthWorktimes = async () => {
		try {
			const rep = await httpGet(`${ENDPOINTS.schedule.month}${date}`);
			if (rep.ok) {
				const data = await rep.json();
				setMonthWorktimes(data);
			}
		} catch (error) {
			console.log('erreur:', error);
		}
	};

	const getWorktimes = async () => {
		try {
			const rep = await httpGet(`${ENDPOINTS.schedule.day}${date}`);
			if (rep.ok) {
				const data = await rep.json();
				setWorktimes(data);
			}
		} catch (error) {
			console.log('erreur:', error);
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
			console.log('erreur:', error);
		}
	};

	return {
		worktimes,
		monthWorktimes,
		unfinishedWorktimes,
		categories,
		date,
		setDate,
		month,
		setMonth,
		modalVisible,
		setModalVisible,
		modalType,
		setModalType,
		timerIsOpen,
		setTimerIsOpen,
		calendarIsOpen,
		setCalendarIsOpen,
		isConnected,
		setWorktimes,
		setCategories,
		selectedWorktime,
		setSelectedWorktime,
	};
};
