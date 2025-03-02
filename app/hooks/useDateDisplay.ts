import { Vibration } from 'react-native';

export const useDateDisplay = (
	date: string,
	setDate: (date: string) => void
) => {
	const handlePrevious = () => {
		Vibration.vibrate(50);
		const currentDate = new Date(date);
		currentDate.setDate(currentDate.getDate() - 1);
		setDate(currentDate.toISOString().split('T')[0]);
	};

	const handleNext = () => {
		Vibration.vibrate(50);
		const currentDate = new Date(date);
		currentDate.setDate(currentDate.getDate() + 1);
		setDate(currentDate.toISOString().split('T')[0]);
	};

	return { handlePrevious, handleNext };
};
