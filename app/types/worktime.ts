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
	startTime: string;
	endTime: string;
	duration: number;
	type: WorktimeType;
	categoryId: number | null;
	category: {
		id: string | null;
		name: string;
	};
	recurrence?: string;
	active: boolean;
	seriesId: number | null;
	// Ajoutez d'autres propriétés si nécessaire
}

/**
 * Interface pour la création d'un worktime
 */
export interface CreateWorktimePayload {
	category: {
		id: string | null;
		name: string;
	};
	startTime: Date | string;
	endTime: Date | string;
	recurrence?: CreateRecurrenceRule;
	startDate?: Date | string;
}

/**
 * Interface pour les séries de worktimes
 */
export interface WorktimeSeries extends Omit<Worktime, 'recurrence'> {
	startDate: string;
	recurrence: CreateRecurrenceRule;
}

/**
 * Interface pour l'objet worktime sélectionné pour modification/suppression
 */
export interface SelectedWorktime extends Worktime {
	isRecurring?: boolean; // Indique si c'est une instance récurrente
	startDate?: string; // Date de début pour les séries récurrentes
	occurrenceId?: number; // ID spécifique à une occurrence dans une série
	originalStartTime?: string; // Heure de début originale pour identifier une occurrence spécifique
	// Propriétés aidant à l'édition du worktime
	formattedDuration?: string; // Durée formatée pour affichage
}
