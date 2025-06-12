import { useState } from 'react';

export const useToggleViews = () => {
	const [calendarIsOpen, setCalendarIsOpen] = useState(false);
	const [timerIsOpen, setTimerIsOpen] = useState(false);
	const [formIsOpen, setFormIsOpen] = useState(false);

	const toggleCalendar = () => {
		setCalendarIsOpen((prev) => {
			if (!prev) setTimerIsOpen(false);
			return !prev;
		});
	};

	const toggleTimer = () => {
		setTimerIsOpen((prev) => {
			if (!prev) setCalendarIsOpen(false);
			return !prev;
		});
	};

	return {
		calendarIsOpen,
		timerIsOpen,
		formIsOpen,
		setFormIsOpen,
		toggleCalendar,
		toggleTimer,
	};
};
