import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import ENDPOINTS from './ENDPOINT';

let TOKEN: string | null = null;
const EXPO_PUBLIC_BASE_URL = 'http://10.0.2.2:8080/';

// Initialize token function
const initToken = async () => {
	TOKEN = await AsyncStorage.getItem('token');
	return TOKEN;
};

// Execute the initialization
initToken().catch((err) => console.error('Failed to initialize token:', err));

export const getDecodedToken = () => (TOKEN ? jwtDecode(TOKEN) : null);
export const decodedToken = null; // Initial value, use getDecodedToken() for current value

export async function checkAndRefreshToken() {
	const token = await AsyncStorage.getItem('token');
	if (!token) return;
	try {
		const decoded = jwtDecode(token);
		const now = Math.floor(Date.now() / 1000);
		if (decoded.exp && decoded.exp - now < 60) {
			const refreshToken = await AsyncStorage.getItem('refreshToken');
			if (!refreshToken) return;
			const response = await fetch(
				`${EXPO_PUBLIC_BASE_URL}${ENDPOINTS.auth.refresh}`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ token: refreshToken }),
				}
			);

			if (response.ok) {
				const data = await response.json();
				if (data.token) await AsyncStorage.setItem('token', data.token);
				if (data.refreshToken)
					await AsyncStorage.setItem('refreshToken', data.refreshToken);
				TOKEN = data.token;
			}
		}
	} catch (e) {
		console.error('Erreur lors du décodage ou du refresh du token', e);
	}
}

export function makeHeaders() {
	const headers = new Headers();
	headers.append('Content-Type', 'application/json');
	if (TOKEN) {
		headers.append('Authorization', `Bearer ${TOKEN}`);
	}
	return { headers: headers };
}

export function makeUrl(url: String) {
	// if (!process.env.EXPO_PUBLIC_BASE_URL) {
	// 	throw new Error('BASE_URL is not defined in .env file');
	// }

	return `${EXPO_PUBLIC_BASE_URL}${url}`;
}

export async function httpGet(url: String, option = {}) {
	await checkAndRefreshToken();
	return fetch(makeUrl(url), {
		method: 'GET',
		...option,
		...makeHeaders(),
	});
}

export async function httpPost(url: String, body: Object, option = {}) {
	console.log('body de la requête :', body);

	await checkAndRefreshToken();
	return fetch(makeUrl(url), {
		method: 'POST',
		...option,
		...makeHeaders(),
		body: JSON.stringify(body),
	});
}

export async function httpPut(url: String, body: Object, option = {}) {
	await checkAndRefreshToken();
	return fetch(makeUrl(url), {
		method: 'PUT',
		...option,
		...makeHeaders(),
		body: JSON.stringify(body),
	});
}

export async function httpDelete(url: String, option = {}) {
	await checkAndRefreshToken();
	return fetch(makeUrl(url), {
		method: 'DELETE',
		...option,
		...makeHeaders(),
	});
}
