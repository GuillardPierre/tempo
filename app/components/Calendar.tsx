import { StyleSheet } from 'react-native';
import { Calendar as RNCalendar } from 'react-native-calendars';
import { useCalendar } from '../hooks/useCalendar';
import {
	RecurrenceException,
	Worktime,
	WorktimeSeries,
} from '../types/worktime';
import { getRRuleFromRecurrence } from './utils/rrule';
import { useThemeColors } from '../hooks/useThemeColors';

type Props = {
	date: string;
	setDate: (date: string) => void;
	monthWorktimes: Worktime[];
	month: Date;
	setMonth: (date: Date) => void;
	recurrenceExceptions: RecurrenceException[];
};

export default function Calendar({
	date,
	setDate,
	monthWorktimes,
	month,
	setMonth,
	recurrenceExceptions,
}: Props) {
	const colors = useThemeColors();
	const { onDayPress } = useCalendar(date, setDate);

	/**
	 * Vérifie si une date est dans une période d'exception
	 */
	function isDateInException(
		date: Date,
		exceptions: RecurrenceException[]
	): boolean {
		const timestamp = date.getTime();
		return exceptions.some((exception) => {
			const start = new Date(exception.pauseStart).getTime();
			const end = new Date(exception.pauseEnd).getTime();
			return timestamp >= start && timestamp <= end;
		});
	}

	/**
	 * Retourne un tableau de dates (format 'YYYY-MM-DD')
	 * où le worktime s'applique, tronqué au mois de `monthDate`.
	 */
	function expandWorktimeDates(
		wt: Worktime | WorktimeSeries,
		monthDate: Date
	): string[] | undefined {
		const year = monthDate.getFullYear();
		const month = monthDate.getMonth();
		const from = new Date(year, month, 1, 0, 0, 0);
		const to = new Date(year, month + 1, 0, 23, 59, 59);

		if (wt.type === 'SINGLE') {
			const d = new Date(wt.startTime);
			if (d >= from && d <= to) {
				return [d.toISOString().slice(0, 10)];
			}
			return [];
		}

		if (wt.recurrence && typeof wt.recurrence === 'string') {
			const endDate = (wt as any).endDate;
			const rrule = getRRuleFromRecurrence(
				wt.recurrence,
				wt.startTime,
				endDate,
				to
			);

			if (!rrule) return [];

			const dates = rrule
				.between(from, to)
				.map((d) => d.toISOString().slice(0, 10))
				.filter((date) => {
					const dateObj = new Date(date);
					return !isDateInException(dateObj, recurrenceExceptions);
				});

			return dates;
		}

		return [];
	}

	// Préparer les marqueurs pour le calendrier
	const markedDates: any = {};

	// Ajouter les worktimes comme des points
	monthWorktimes.forEach((wt) => {
		const dates = expandWorktimeDates(wt, month);
		if (dates) {
			dates.forEach((d) => {
				if (!markedDates[d]) {
					markedDates[d] = {};
				}
				markedDates[d] = {
					...markedDates[d],
					marked: true,
					dotColor: wt.type === 'SINGLE' ? colors.secondary : colors.primary,
				};
			});
		}
	});

	// Ajouter les exceptions comme des périodes
	recurrenceExceptions.forEach((exception) => {
		const start = new Date(exception.pauseStart);
		const end = new Date(exception.pauseEnd);

		// Générer toutes les dates entre start et end
		let current = new Date(start);
		while (current <= end) {
			const dateStr = current.toISOString().slice(0, 10);

			// Vérifier si la date est dans le mois actuel
			if (
				current.getMonth() === month.getMonth() &&
				current.getFullYear() === month.getFullYear()
			) {
				const isStart = current.getTime() === start.getTime();
				const isEnd = current.getTime() === end.getTime();

				markedDates[dateStr] = {
					...markedDates[dateStr], // Préserver les marqueurs existants
					color: colors.primaryLight,
					textColor: colors.primaryText,
					...(isStart && { startingDay: true }),
					...(isEnd && { endingDay: true }),
					...(!isStart && !isEnd && { color: colors.primaryLight }),
					// Si on a déjà un point, on le garde avec sa couleur d'origine
					...(markedDates[dateStr]?.marked && {
						marked: true,
						dotColor: markedDates[dateStr].dotColor,
					}),
				};
			}

			// Passer au jour suivant
			current.setDate(current.getDate() + 1);
		}
	});
	// Marquer la date sélectionnée - forcer la couleur rouge
	markedDates[date] = {
		...markedDates[date],
		selected: true,
		color: colors.primary,
		textColor: colors.primaryText,
		startingDay: true,
		endingDay: true,
	};

	return (
		<RNCalendar
			style={styles.calendar}
			theme={{
				calendarBackground: colors.background,
				monthTextColor: colors.secondaryText,
				textSectionTitleColor: colors.secondaryText,
				dayTextColor: colors.secondaryText,
				todayTextColor: colors.primaryText,
				todayBackgroundColor: colors.secondary,
				selectedDayTextColor: colors.primary,
				selectedDayBackgroundColor: colors.primary,
				textDisabledColor: colors.secondaryText,
			}}
			current={date}
			onDayPress={onDayPress}
			markedDates={markedDates}
			markingType='period'
			onMonthChange={(month) => {
				setMonth(new Date(month.timestamp));
			}}
			firstDay={1}
		/>
	);
}

const styles = StyleSheet.create({
	calendar: {
		marginBottom: 10,
		borderRadius: 10,
		elevation: 4,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.23,
		shadowRadius: 2.62,
	},
});
