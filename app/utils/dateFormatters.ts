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

export const formatDateRange = (
	start: string | undefined,
	end: string | undefined,
	type?: string
): string => {
	const formatDate = (dateString: string | undefined): string => {
		if (!dateString) return '';
		const date = new Date(dateString);
		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const year = date.getFullYear();
		const hours = date.getHours().toString().padStart(2, '0');
		const minutes = date.getMinutes().toString().padStart(2, '0');
		return `${hours}:${minutes} ${day}-${month}-${year}`;
	};

	// Gestion spéciale selon le type
	let endFormatted = formatDate(end);
	if (type === 'SINGLE' && !end) {
		endFormatted = 'pas de fin';
	}

	return `Du: ${formatDate(start) || '00:00'} au: ${endFormatted}`;
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
