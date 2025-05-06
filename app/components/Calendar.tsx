import { Fragment, useState } from 'react';
import { StyleSheet } from 'react-native';
import { DateData, Calendar as RNCalendar } from 'react-native-calendars';
import { useCalendar } from '../hooks/useCalendar';
import { Worktime } from '../types/worktime';
import { RRule } from 'rrule';

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
	const { onDayPress } = useCalendar(date, setDate);

	// const [month, setMonth] = useState(new Date(date));

	console.log(month);

	/**
	 * Retourne un tableau de dates (format 'YYYY-MM-DD')
	 * où le worktime s’applique, tronqué au mois de `monthDate`.
	 *
	 * @param {Worktime} wt – worktime { startTime, endTime, recurrence, type, … }
	 * @param {Date} monthDate – une date quelconque dans le mois à traiter
	 * @returns {string[]}
	 */
	function expandWorktimeDates(
		wt: Worktime,
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

		// RECURRING
		if (wt.recurrence) {
			const rule = RRule.fromString(wt.recurrence);
			// On fixe le DTSTART au jour de startTime
			rule.options.dtstart = new Date(wt.startTime);
			// Limiter à l’intervalle du mois
			rule.options.until = to;
			const r = new RRule(rule.options);

			// Génère toutes les occurrences entre from et to
			const dates = r.between(from, to, true);
			// On renvoie uniquement la partie date
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
			};
		} = {};

		// Définition des styles « dots »
		const stylesByType = {
			SINGLE: { key: 'single', color: 'red', selectedDotColor: 'red' },
			RECURRING: {
				key: 'recurring',
				color: 'green',
				selectedDotColor: 'green',
			},
		};

		worktimes.forEach((wt) => {
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
				locale={'fr'}
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
