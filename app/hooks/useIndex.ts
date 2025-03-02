import { useState } from 'react';

export const useIndex = () => {
	const data = [
		{
			type: 'time',
			text: 'Sleep',
			startTime: '08:00',
			endTime: '09:00',
			duration: '1h',
		},
		{
			type: 'time',
			text: 'Work',
			startTime: '09:00',
			endTime: '10:00',
			duration: '1h',
		},
		{
			type: 'time',
			text: 'Work',
			startTime: '10:00',
			endTime: '11:00',
			duration: '1h',
		},
		{
			type: 'time',
			text: 'Work',
			startTime: '11:00',
			endTime: '12:00',
			duration: '1h',
		},
		{
			type: 'time',
			text: 'Work',
			startTime: '12:00',
			endTime: '13:00',
			duration: '1h',
		},
		{
			type: 'time',
			text: 'Work',
			startTime: '13:00',
			endTime: '14:00',
			duration: '1h',
		},
		{
			type: 'time',
			text: 'Work',
			startTime: '14:00',
			endTime: '15:00',
			duration: '1h',
		},
		{
			type: 'time',
			text: 'Work',
			startTime: '15:00',
			endTime: '16:00',
			duration: '1h',
		},
		{
			type: 'time',
			text: 'Work',
			startTime: '16:00',
			endTime: '17:00',
			duration: '1h',
		},
	];

	const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
	const [modalVisible, setModalVisible] = useState(false);
	const [modalType, setModalType] = useState<'menu' | 'delete'>('menu');
	const [blockToDelete, setBlockToDelete] = useState<number | null>(null);
	const [timerIsOpen, setTimerIsOpen] = useState(false);
	const [calendarIsOpen, setCalendarIsOpen] = useState(false);

	return {
		data,
		date,
		setDate,
		modalVisible,
		setModalVisible,
		modalType,
		setModalType,
		blockToDelete,
		setBlockToDelete,
		timerIsOpen,
		setTimerIsOpen,
		calendarIsOpen,
		setCalendarIsOpen,
	};
};
