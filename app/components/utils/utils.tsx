import AsyncStorage from '@react-native-async-storage/async-storage';

export default async function IsConnected() {
	const value = await AsyncStorage.getItem('token');
	if (value) {
		return true;
	}
	return false;
}

export function getToken() {
	return AsyncStorage.getItem('token').then((value) => {
		if (value) {
			return value;
		}
		return null;
	});
}

export async function deleteToken() {
	return await AsyncStorage.removeItem('token').then(() => {
		return true;
	});
}

export const formatDate = (dateString: string | undefined): string => {
	if (!dateString) return '';

	const date = new Date(dateString);

	// Get hours and minutes with leading zeros
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');

	// Get day, month, and year with leading zeros where needed
	const day = date.getDate().toString().padStart(2, '0');
	const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
	const year = date.getFullYear();

	return `${hours}:${minutes} ${day}-${month}-${year}`;
};

export const formatDateWihtoutTime = (
	dateString: string | undefined
): string => {
	if (!dateString) return '';

	const date = new Date(dateString);

	// Get day, month, and year with leading zeros where needed
	const day = date.getDate().toString().padStart(2, '0');
	const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
	const year = date.getFullYear();

	return `${day}-${month}-${year}`;
};
