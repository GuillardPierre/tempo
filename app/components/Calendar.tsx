import { Fragment, useState } from 'react';
import { StyleSheet } from 'react-native';
import { DateData, Calendar as RNCalendar } from 'react-native-calendars';
import { useCalendar } from '../hooks/useCalendar';
import { Worktime, WorktimeSeries } from '../types/worktime';
import { getRRuleFromRecurrence } from './utils/rrule';
import { useThemeColors } from '../hooks/useThemeColors';

type Props = {
	date: string;
	setDate: (date: string) => void;
	monthWorktimes: Worktime[];
	month: Date;
	setMonth: (date: Date) => void;
};

export default function Calendar({
	date,
	setDate,
	monthWorktimes,
	month,
	setMonth,
}: Props) {
	const colors = useThemeColors();
	const { onDayPress } = useCalendar(date, setDate);

	// Définition des styles « dots »
	const stylesByType = {
		SINGLE: {
			key: 'single',
			color: colors.secondary,
			selectedDotColor: colors.secondary,
		},
		RECURRING: {
			key: 'recurring',
			color: colors.primary,
			selectedDotColor: colors.primary,
		},
	};

	/**
	 * Retourne un tableau de dates (format 'YYYY-MM-DD')
	 * où le worktime s'applique, tronqué au mois de `monthDate`.
	 *
	 * @param {Worktime | WorktimeSeries} wt – worktime { startTime, endTime, recurrence, type, … }
	 * @param {Date} monthDate – une date quelconque dans le mois à traiter
	 * @returns {string[]}
	 */
	function expandWorktimeDates(
		wt: Worktime | WorktimeSeries,
		monthDate: Date
	): string[] | undefined {
		const year = monthDate.getFullYear();
		const month = monthDate.getMonth(); // 0-indexed
		const from = new Date(year, month, 1, 0, 0, 0);
		const to = new Date(year, month + 1, 0, 23, 59, 59);

		if (wt.type === 'SINGLE') {
			const d = new Date(wt.startTime);
			if (d >= from && d <= to) {
				return [d.toISOString().slice(0, 10)];
			}
			return [];
		}

		// RÉCURRENCE
		if (wt.recurrence && typeof wt.recurrence === 'string') {
			const endDate = (wt as any).endDate;
			const rrule = getRRuleFromRecurrence(
				wt.recurrence,
				wt.startTime,
				endDate,
				to
			);
			if (!rrule) return [];
			const dates = rrule.between(from, to, true);
			return dates.map((d) => d.toISOString().slice(0, 10));
		}
	}

	/**
	 * @param {Array} worktimes – tableau des worktime objets
	 * @param {Date}  monthDate  – date dans le mois à afficher
	 * @returns {Object} markedDates
	 */
	function buildMarkedDates(worktimes: Worktime[], monthDate: Date) {
		const marked: {
			[date: string]: {
				dots: { key: string; color: string; selectedDotColor: string }[];
				selected: boolean;
				selectedColor?: string;
			};
		} = {};

		if (worktimes.length === 0) return marked;
		worktimes?.forEach((wt) => {
			const dates = expandWorktimeDates(wt, monthDate);
			if (!dates) return;
			dates.forEach((date) => {
				if (!marked[date]) {
					marked[date] = { dots: [], selected: false };
				}
				// On empêche les doublons de même type
				const style = stylesByType[wt.type];
				if (!marked[date].dots.some((d) => d.key === style.key)) {
					marked[date].dots.push(style);
				}
			});
		});

		return marked;
	}

	const markedDates = buildMarkedDates(monthWorktimes, month);
	// Ajout du style pour la date sélectionnée
	markedDates[date] = {
		...(markedDates[date] || { dots: [] }),
		selected: true,
		selectedColor: colors.primaryLight,
	};

	return (
		<Fragment>
			<RNCalendar
				markingType={'multi-dot'}
				enableSwipeMonths
				current={date}
				style={styles.calendar}
				onDayPress={onDayPress}
				markedDates={markedDates}
				onMonthChange={(month: DateData) =>
					setMonth(new Date(month.dateString))
				}
				firstDay={1}
			/>
		</Fragment>
	);
}

const styles = StyleSheet.create({
	calendar: {
		marginBottom: 0,
	},
});
