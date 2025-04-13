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
