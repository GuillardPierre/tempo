import { RRule } from 'rrule';

/**
 * Parse une string de récurrence et retourne un objet RRule prêt à l'emploi.
 * @param recurrence La règle de récurrence au format string (RFC5545)
 * @param startTime Date de début de la série (ISO string)
 * @param endDate Date de fin de la série (ISO string, optionnelle)
 * @param fallbackUntil Date de fin par défaut si endDate n'est pas fournie
 * @returns RRule ou null si parsing impossible
 */
export function getRRuleFromRecurrence(
	recurrence: string | undefined,
	startTime: string,
	endDate?: string,
	fallbackUntil?: Date
): RRule | null {
	if (!recurrence) return null;
	try {
		const options = RRule.parseString(recurrence);
		options.dtstart = new Date(startTime);
		options.until = endDate ? new Date(endDate) : fallbackUntil;
		return new RRule(options);
	} catch (e) {
		// Erreur de parsing : on retourne null
		return null;
	}
}
