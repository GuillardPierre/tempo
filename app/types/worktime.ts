/**
 * Types liés aux worktimes dans l'application
 */

/**
 * Catégorie pour les worktimes
 */
export interface Category {
	id: number | string | null;
	name: string;
	// Ajoutez d'autres propriétés de catégorie si nécessaire
}

/**
 * Interface pour les informations de récurrence
 */
export interface CreateRecurrenceRule {
	freq: string;
	byDay?: string[];
}

/**
 * Type des types de worktime (ponctuel ou récurrent)
 */
export type WorktimeType = 'SINGLE' | 'RECURRING';

/**
 * Interface pour les worktimes reçus de l'API
 */
export interface Worktime {
	id?: number;
	categoryName: string;
	startHour: string;
	endHour: string;
	duration: number;
	type: WorktimeType;
	categoryId: number | null;
	category: {
		id: string | null;
		name: string;
	};
	recurrence?: string;
	ignoreExceptions?: boolean; // Uniquement pour les wortimeSeries
}

/**
 * Interface pour la création d'un worktime
 */
export interface CreateWorktimePayload {
	category: {
		id: string | null;
		name: string;
	};
	startHour: Date | string;
	endHour: Date | string;
	recurrence?: CreateRecurrenceRule;
	startDate?: Date | string;
}

/**
 * Interface pour les séries de worktimes
 */
export interface WorktimeSeries extends Omit<Worktime, 'recurrence'> {
	startDate: string;
	endDate?: string;
	recurrence: CreateRecurrenceRule;
}

/**
 * Interface pour l'objet worktime sélectionné pour modification/suppression
 */
export interface SelectedWorktime extends Worktime {
	isRecurring?: boolean;
	startDate?: string;
	endDate?: string;
	occurrenceId?: number;
	originalStartTime?: string;
	formattedDuration?: string; // Durée formatée pour affichage
	ignoreExceptions?: boolean;
}

/**
 * Interface pour les exceptions de récurrence
 */
export interface RecurrenceException {
	id?: number;
	pauseStart: string;
	pauseEnd: string;
	seriesIds: number[];
}

/**
 * Interface pour organiser les worktimes par jour
 */
export interface WorktimeByDay {
	yesterday: WorktimeSeries[];
	today: WorktimeSeries[];
	tomorrow: WorktimeSeries[];
}
