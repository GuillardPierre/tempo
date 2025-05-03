import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { httpGet } from '../components/utils/querySetup';
import ENDPOINTS from '../components/utils/ENDPOINT';
import { Category, Worktime } from '../types/worktime';

export const useIndex = () => {
	const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
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

	useEffect(() => {
		checkConnection();
		getCategrories();
	}, []);

	// Nouvel useEffect pour déclencher getWorktimes à chaque changement de date
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
		categories,
		date,
		setDate,
		modalVisible,
		setModalVisible,
		modalType,
		setModalType,
		timerIsOpen,
		setTimerIsOpen,
		calendarIsOpen,
		setCalendarIsOpen,
		isConnected,
		setIsConnected,
		setWorktimes,
		setCategories,
		selectedWorktime,
		setSelectedWorktime,
	};
};
