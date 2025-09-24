import { useState } from 'react';

export const useToggleViews = () => {
	const [calendarIsOpen, setCalendarIsOpen] = useState(false);
	const [timerIsOpen, setTimerIsOpen] = useState(false);
	const [formIsOpen, setFormIsOpen] = useState(false);
	const [chronoOpen, setChronoOpen] = useState(false);

	const toggleCalendar = () => {
		setCalendarIsOpen((prev) => {
			if (!prev) setTimerIsOpen(false);
			return !prev;
		});
	};

	const toggleTimer = () => {
		setTimerIsOpen((prev) => {
			if (!prev) {
				setCalendarIsOpen(false);
			} else {
				// Quand le timer se ferme, fermer aussi le chrono
				setChronoOpen(false);
			}
			return !prev;
		});
	};

	const setFormIsOpenWithChrono = (isOpen: boolean) => {
		setFormIsOpen(isOpen);
		if (!isOpen) {
			setChronoOpen(false);
		}
	};

	const handleChronoStart = () => {
		setChronoOpen(true);
	};

	const handleChronoClose = () => {
		setChronoOpen(false);
	};

	return {
		calendarIsOpen,
		timerIsOpen,
		formIsOpen,
		chronoOpen,
		setFormIsOpen: setFormIsOpenWithChrono,
		toggleCalendar,
		toggleTimer,
		handleChronoStart,
		handleChronoClose,
	};
};
