import { useCallback, useMemo, useState } from 'react';
import { CalendarUtils, DateData, LocaleConfig } from 'react-native-calendars';
import { useThemeColors } from './useThemeColors';

LocaleConfig.locales['fr'] = {
	monthNames: [
		'Janvier',
		'Février',
		'Mars',
		'Avril',
		'Mai',
		'Juin',
		'Juillet',
		'Août',
		'Septembre',
		'Octobre',
		'Novembre',
		'Décembre',
	],
	monthNamesShort: [
		'Janv.',
		'Févr.',
		'Mars',
		'Avril',
		'Mai',
		'Juin',
		'Juil.',
		'Août',
		'Sept.',
		'Oct.',
		'Nov.',
		'Déc.',
	],
	dayNames: [
		'Dimanche',
		'Lundi',
		'Mardi',
		'Mercredi',
		'Jeudi',
		'Vendredi',
		'Samedi',
	],
	dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
	today: "Aujourd'hui",
};
LocaleConfig.defaultLocale = 'fr';

export const useCalendar = (date: string, setDate: (date: string) => void) => {
	const colors = useThemeColors();

	const [currentMonth, setCurrentMonth] = useState(date);

	const getDate = (count: number) => {
		const theDate = new Date(date);
		const newDate = theDate.setDate(theDate.getDate() + count);
		return CalendarUtils.getCalendarDateString(newDate);
	};

	const onDayPress = useCallback((day: DateData) => {
		setDate(day.dateString);
	}, []);

	const marked = useMemo(() => {
		return {
			[getDate(0)]: {
				dotColor: 'red',
				marked: true,
			},
			[date]: {
				selected: true,
				disableTouchEvent: true,
				selectedColor: colors.secondary,
				selectedTextColor: 'black',
			},
		};
	}, [date]);

	return { currentMonth, setCurrentMonth, onDayPress, marked };
};
