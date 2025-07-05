import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateToken } from './querySetup';

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
	await AsyncStorage.multiRemove([
		'token',
		'refreshToken',
		'email',
		'username',
		'id',
	]);
	await updateToken();
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

export function formatLocalDateTime(date: Date) {
	const pad = (n: number) => n.toString().padStart(2, '0');
	return (
		date.getFullYear() +
		'-' +
		pad(date.getMonth() + 1) +
		'-' +
		pad(date.getDate()) +
		'T' +
		pad(date.getHours()) +
		':' +
		pad(date.getMinutes()) +
		':00'
	);
}
