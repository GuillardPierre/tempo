/**
 * Utilitaires de formatage de dates
 * À utiliser quand on n'a pas besoin d'un hook React
 */

export const formatTime = (time: string | undefined): string => {
	if (!time) return '';
	const date = new Date(time);
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');
	return `${hours}:${minutes}`;
};

export const formatDateTime = (dateString: string | undefined): string => {
	if (!dateString) return '';
	const date = new Date(dateString);
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const year = date.getFullYear();
	return `${hours}:${minutes} ${day}-${month}-${year}`;
};



// Fonction utilitaire pour formater seulement l'heure
const formatHourOnly = (hourString: string | undefined): string => {
	if (!hourString) return '00:00';
	const date = new Date(hourString);
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');
	return `${hours}:${minutes}`;
};

export const formatDateRange = (
	startDate: string | undefined,
	endDate: string | undefined,
	startHour: string | undefined,
	endHour: string | undefined,
	type?: string
): string => {
	// Gestion selon le type
	if (type === 'RECURRING') {
		
		// Pour RECURRING : séparer la période de la série et les horaires
		const startDateFormatted = formatDateOnly(startDate);
		const startHourFormatted = formatHourOnly(startHour);
		const endHourFormatted = formatHourOnly(endHour);
		
		// Si pas de date de fin : série infinie
		if (!endDate || endDate === 'null' || endDate === '') {
			return `À partir du ${startDateFormatted}, de ${startHourFormatted} à ${endHourFormatted}`;
		}
		
		// Si date de fin : série avec période définie
		const endDateFormatted = formatDateOnly(endDate);
		return `Du ${startDateFormatted} au ${endDateFormatted}, de ${startHourFormatted} à ${endHourFormatted}`;
	} else if (type === 'SINGLE') {
		// Pour SINGLE : utiliser seulement les heures
		const startHourFormatted = formatHourOnly(startHour);
		const endHourFormatted = endHour ? formatHourOnly(endHour) : 'en cours';
		
		return `De ${startHourFormatted} à ${endHourFormatted}`;
	} else {
		// Comportement par défaut (fallback)
		const startFormatted = startDate ? formatDateTime(startDate) : formatHourOnly(startHour);
		const endFormatted = endDate ? formatDateTime(endDate) : (endHour ? formatHourOnly(endHour) : 'pas de fin');
		
		return `Du ${startFormatted} au ${endFormatted}`;
	}
};

export const formatDuration = (duration: number): string => {
	const hours = Math.floor(duration / 60);
	if (hours > 0) {
		return `${hours}h${duration % 60 < 10 ? '0' : ''}${duration % 60}`;
	} else {
		return `${duration < 10 ? '0' : ''}${duration}m`;
	}
};

export const formatDateOnly = (dateString: string | undefined): string => {
	if (!dateString) return '';
	const date = new Date(dateString);
	const day = date.getDate().toString().padStart(2, '0');
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const year = date.getFullYear();
	return `${day}-${month}-${year}`;
};
