
import { useVibration } from './useVibration';

export const useDateDisplay = (
	date: string,
	setDate: (date: string) => void
) => {
	const { vibrate } = useVibration();
	const handlePrevious = () => {
		vibrate();
		const currentDate = new Date(date);
		currentDate.setDate(currentDate.getDate() - 1);
		setDate(currentDate.toISOString().split('T')[0]);
	};

	const handleNext = () => {
		vibrate();
		const currentDate = new Date(date);
		currentDate.setDate(currentDate.getDate() + 1);
		setDate(currentDate.toISOString().split('T')[0]);
	};

	return { handlePrevious, handleNext };
};
