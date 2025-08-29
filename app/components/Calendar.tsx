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
			const endPlusOneDay = new Date(end);
			endPlusOneDay.setDate(endPlusOneDay.getDate() + 1);
			return timestamp >= start && timestamp < endPlusOneDay.getTime();
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
			const d = new Date(wt.startHour);
			if (d >= from && d <= to) {
				return [d.toISOString().slice(0, 10)];
			}
			return [];
		}

		if (wt.recurrence && typeof wt.recurrence === 'string') {
			const startDate = (wt as any).startDate;
			const endDate = (wt as any).endDate;
			
			// Utiliser startDate pour la récurrence, pas startHour
			const rrule = getRRuleFromRecurrence(
				wt.recurrence,
				startDate || wt.startHour,
				endDate,
				to
			);

			if (!rrule) {
				return [];
			}

			// Générer les dates de récurrence
			const allDates = rrule.between(from, to);
			
			// Filtrer pour respecter les dates de début et fin de série
			const filteredDates = allDates.filter((d) => {
				// Vérifier que la date est dans la période de la série
				if (startDate) {
					const startDateObj = new Date(startDate + 'Z');
					// Comparer seulement les dates (sans l'heure) pour startDate
					const startDateOnly = new Date(startDateObj.getFullYear(), startDateObj.getMonth(), startDateObj.getDate());
					const dDateOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());
					const isBeforeStart = dDateOnly < startDateOnly;
					if (isBeforeStart) return false;
				}
				
				if (endDate) {
					const endDateObj = new Date(endDate + 'Z');
					// Comparer seulement les dates (sans l'heure) pour endDate
					const endDateOnly = new Date(endDateObj.getFullYear(), endDateObj.getMonth(), endDateObj.getDate());
					const dDateOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());
					const isAfterEnd = dDateOnly > endDateOnly;
					if (isAfterEnd) return false;
				}
				
				return true;
			});
			
			// Convertir en format YYYY-MM-DD
			const dateStrings = filteredDates.map((d) => d.toISOString().slice(0, 10));
			
			// Filtrer les exceptions
			const finalDates = dateStrings.filter((date) => {
				const dateObj = new Date(date);
				const isInException = isDateInException(dateObj, recurrenceExceptions);
				return !isInException;
			});

			return finalDates;
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
					markedDates[d] = { dots: [] };
				}
				
				// Initialiser dots si pas encore présent
				if (!markedDates[d].dots) {
					markedDates[d].dots = [];
				}
				
				// Vérifier si on a déjà un point pour ce type de worktime
				const hasRecurringDot = markedDates[d].dots.some((dot: any) => 
					dot.key.startsWith('recurring-')
				);
				const hasNonRecurringDot = markedDates[d].dots.some((dot: any) => 
					dot.key.startsWith('non-recurring-')
				);
				
				// Ajouter le point seulement si on n'en a pas déjà un pour ce type
				if (wt.type === 'RECURRING' && !hasRecurringDot) {
					markedDates[d].dots.push({
						key: `recurring-${d}`,
						color: colors.primary,
					});
				} else if (wt.type === 'SINGLE' && !hasNonRecurringDot) {
					markedDates[d].dots.push({
						key: `non-recurring-${d}`,
						color: colors.secondary,
					});
				}
				
				// Garder la propriété marked pour la compatibilité
				markedDates[d].marked = true;
			});
		}
	});

	// Ajouter les exceptions comme des dots
	recurrenceExceptions.forEach((exception) => {
		const start = new Date(exception.pauseStart + 'Z');
		const end = new Date(exception.pauseEnd + 'Z');

		// Générer toutes les dates entre start et end (inclus)
		let current = new Date(start);
		const endDate = new Date(end);
		endDate.setDate(endDate.getDate() + 1); // Inclure le jour de fin
		
		while (current < endDate) {
			const dateStr = current.toISOString().slice(0, 10);

			// Vérifier si la date est dans le mois actuel
			const isInCurrentMonth = current.getMonth() === month.getMonth() && current.getFullYear() === month.getFullYear();

			if (isInCurrentMonth) {
				// Créer un dot pour l'exception
				const exceptionDot = {
					key: `exception-${exception.id}-${dateStr}`,
					color: colors.primaryLight,
				};

				if (!markedDates[dateStr]) {
					markedDates[dateStr] = { dots: [] };
				}

				// Initialiser dots si pas encore présent
				if (!markedDates[dateStr].dots) {
					markedDates[dateStr].dots = [];
				}

				// Vérifier si on a déjà un point d'exception pour cette date
				const hasExceptionDot = markedDates[dateStr].dots.some((dot: any) => 
					dot.key.startsWith('exception-')
				);

				// Ajouter le dot d'exception seulement s'il n'y en a pas déjà un
				if (!hasExceptionDot) {
					markedDates[dateStr].dots.push(exceptionDot);
				}

				// Garder la propriété marked pour la compatibilité
				markedDates[dateStr].marked = true;
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
		textColor: '#FFFFFF',
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
				selectedDayTextColor: '#FFFFFF',
				selectedDayBackgroundColor: colors.primary,
				textDisabledColor: colors.secondaryText,
			}}
			current={date}
			onDayPress={onDayPress}
			markedDates={markedDates}
			markingType='multi-dot'
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
