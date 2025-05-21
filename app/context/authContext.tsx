import { createContext, useReducer, Dispatch } from 'react';
import {
	initialAuthState,
	AuthReducer,
	AuthAction,
	AuthState,
} from '../reducer/AuthReducer';

export interface AuthContextType {
	state: AuthState;
	dispatch: Dispatch<AuthAction>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [state, dispatch] = useReducer(AuthReducer, initialAuthState);

	return (
		<AuthContext.Provider value={{ state, dispatch }}>
			{children}
		</AuthContext.Provider>
	);
};
