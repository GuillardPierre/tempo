export interface AuthState {
	isConnected: boolean;
	id: number | null;
	username: string | null;
	email: string | null;
	token: string | null;
}

export interface AuthAction {
	type: string;
	payload?: any;
}

export const initialAuthState = {
	isConnected: false,
	id: null,
	email: null,
	username: null,
	token: null,
};

export const AuthReducer = (
	state: AuthState,
	action: AuthAction
): AuthState => {
	switch (action.type) {
		case 'SET_IS_CONNECTED':
			return { ...state, isConnected: action.payload };
		case 'SET_EMAIL':
			return { ...state, email: action.payload };
		case 'SET_USERNAME':
			return { ...state, username: action.payload };
		case 'SET_TOKEN':
			return { ...state, token: action.payload };
		case 'SET_ID':
			return { ...state, id: action.payload };
		default:
			return state;
	}
};
