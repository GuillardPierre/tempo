/**
 * Formate une règle de récurrence RRULE selon le standard RFC5545
 * @param selectedDays - Tableau des jours sélectionnés (ex: ['MO', 'TU', 'WE'])
 * @returns Règle de récurrence formatée
 */
export function formatRecurrenceRule(selectedDays: string[]): string {
	if (!selectedDays || selectedDays.length === 0) {
		return '';
	}
	
	// Nettoyer et valider les jours
	const validDays = selectedDays.filter(day => 
		['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'].includes(day)
	);
	
	// Supprimer les doublons
	const uniqueDays = [...new Set(validDays)];
	
	// Trier les jours dans l'ordre logique (Lun -> Dim)
	const dayOrder = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
	const sortedDays = uniqueDays.sort((a, b) => 
		dayOrder.indexOf(a) - dayOrder.indexOf(b)
	);
	
	return `FREQ=WEEKLY;BYDAY=${sortedDays.join(',')}`;
}

/**
 * Parse et nettoie une règle de récurrence reçue du serveur
 * @param recurrence - Règle de récurrence (peut contenir des caractères d'échappement)
 * @returns Tableau des jours nettoyés
 */
export function parseRecurrenceRule(recurrence: string): string[] {
	if (!recurrence) return [];
	
	try {
		// Nettoyer les caractères d'échappement et les guillemets
		let cleanedRecurrence = recurrence
			.replace(/\\"/g, '"')  // Remplacer \" par "
			.replace(/\\\\/g, '\\') // Remplacer \\ par \
			.replace(/\\/g, '')    // Supprimer les \ restants
			.replace(/"/g, '');    // Supprimer tous les guillemets
		
		// Extraire la partie BYDAY avec une regex plus robuste
		const byDayMatch = cleanedRecurrence.match(/BYDAY=([^;]+)/);
		if (!byDayMatch) {
			return [];
		}
		
		// Diviser par les virgules et nettoyer chaque jour
		const days = byDayMatch[1].split(',').map(day => day.trim());
		
		// Valider et filtrer les jours valides
		const validDays = days.filter(day => 
			['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'].includes(day)
		);
		
		// Supprimer les doublons
		const uniqueDays = [...new Set(validDays)];
		
		return uniqueDays;
		
	} catch (error) {
		console.error('Erreur lors du parsing de la récurrence:', error);
		return [];
	}
} 