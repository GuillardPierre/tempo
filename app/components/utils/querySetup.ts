import AsyncStorage from '@react-native-async-storage/async-storage';

let TOKEN: String | null = null;
const EXPO_PUBLIC_BASE_URL = 'http://10.0.2.2:8080/';

AsyncStorage.getItem('token').then((token) => {
	TOKEN = token;
});

export function makeHeaders() {
	const headers = new Headers();
	headers.append('Content-Type', 'application/json');
	if (TOKEN) {
		headers.append('Authorization', `Bearer ${TOKEN}`);
	}
	console.log('Headers:', headers);
	return { headers: headers };
}

export function makeUrl(url: String) {
	// if (!process.env.EXPO_PUBLIC_BASE_URL) {
	// 	throw new Error('BASE_URL is not defined in .env file');
	// }

	return `${EXPO_PUBLIC_BASE_URL}${url}`;
}

export function httpGet(url: String, option = {}) {
	return fetch(makeUrl(url), {
		method: 'GET',
		...option,
		...makeHeaders(),
	});
}

export function httpPost(url: String, body: Object, option = {}) {
	return fetch(makeUrl(url), {
		method: 'POST',
		...option,
		...makeHeaders(),
		body: JSON.stringify(body),
	});
}

export function httpPut(url: String, body: Object, option = {}) {
	return fetch(makeUrl(url), {
		method: 'PUT',
		...option,
		...makeHeaders(),
		body: JSON.stringify(body),
	});
}

export function httpDelete(url: String, option = {}) {
	return fetch(makeUrl(url), {
		method: 'DELETE',
		...option,
		...makeHeaders(),
	});
}
