export interface WorktimeSeries {
	id: string;
	type: string;
	startHour: string;
	endHour: string | null;
	startDate: string;
	endDate: string | null;
	recurrence: string;
	categoryName: string;
	duration: number;
	categoryId: string;
	seriesId: string;
}

export interface RecurrenceException {
	id: string;
	pauseStart: string;
	pauseEnd: string;
	seriesIds: string[];
}

export interface Category {
	id: string;
	name: string;
	color: string;
}

export type ModalType = 'menu' | 'update' | 'exception';
