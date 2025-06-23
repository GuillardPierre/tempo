import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import ENDPOINTS from './ENDPOINT';

export let TOKEN: string | null = null;
let REFRESH_TOKEN: string | null = null;
// const EXPO_PUBLIC_BASE_URL = 'http://192.168.1.147:8080/';
// const EXPO_PUBLIC_BASE_URL = 'http://92.184.121.157:8080/';
const EXPO_PUBLIC_BASE_URL = 'http://10.0.2.2:8080/';

// Initialize token function
const initToken = async () => {
	TOKEN = await AsyncStorage.getItem('token');
	return TOKEN;
};

// Fonction pour mettre à jour la variable globale TOKEN
export const updateToken = async () => {
	TOKEN = await AsyncStorage.getItem('token');
	return TOKEN;
};

const initRefreshToken = async () => {
	REFRESH_TOKEN = await AsyncStorage.getItem('refreshToken');
	return REFRESH_TOKEN;
};

// Execute the initialization
initToken().catch((err) => console.error('Failed to initialize token:', err));
initRefreshToken().catch((err) =>
	console.error('Failed to initialize refresh token:', err)
);

export const getDecodedToken = () => (TOKEN ? jwtDecode(TOKEN) : null);
export const decodedRefreshToken = () =>
	REFRESH_TOKEN ? jwtDecode(REFRESH_TOKEN) : null;

export async function checkAndRefreshToken() {
	const token = await AsyncStorage.getItem('token');

	if (!token) {
		TOKEN = null;
		return false;
	}
	try {
		const decoded = jwtDecode(token);
		const now = Math.floor(Date.now() / 1000);
		if (decoded.exp && decoded.exp - now < 60) {
			const refreshToken = await AsyncStorage.getItem('refreshToken');
			if (!refreshToken) {
				TOKEN = null;
				return false;
			}
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
					await AsyncStorage.setItem(
						'refreshToken',
						data.refreshToken
					);
				TOKEN = data.token;
				return true;
			} else {
				await AsyncStorage.removeItem('token');
				await AsyncStorage.removeItem('refreshToken');
				TOKEN = null;
				return false;
			}
		}
		return true;
	} catch (e) {
		await AsyncStorage.removeItem('token');
		await AsyncStorage.removeItem('refreshToken');
		TOKEN = null;
		return false;
	}
}

export function makeHeaders(isLogin: boolean = false) {
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

export async function httpPost(
	url: String,
	body: Object,
	option = { isLogin: false }
) {
	console.log('body POST :', body);
	if (option.isLogin) {
		TOKEN = null;
		REFRESH_TOKEN = null;
	}
	if (!option.isLogin) {
		await checkAndRefreshToken();
	}
	try {
		return fetch(makeUrl(url), {
			method: 'POST',
			...option,

			...makeHeaders(),
			body: JSON.stringify(body),
		});
	} catch (error) {
		console.log('Erreur Post:', error);
	}
}

export async function httpPut(url: String, body: Object, option = {}) {
	console.log('body PUT :', body);

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
