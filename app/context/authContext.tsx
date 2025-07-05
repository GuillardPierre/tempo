import {
	createContext,
	useReducer,
	Dispatch,
	useEffect,
	useContext,
	useState,
} from 'react';
import {
	initialAuthState,
	AuthReducer,
	AuthAction,
	AuthState,
} from '../reducer/AuthReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

export interface AuthContextType {
	state: AuthState;
	dispatch: Dispatch<AuthAction>;
	isInitialized: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined
);

// Hook personnalisé pour utiliser le contexte de manière sûre
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [state, dispatch] = useReducer(AuthReducer, initialAuthState);
	const [isInitialized, setIsInitialized] = useState(false);

	// Synchroniser le contexte avec AsyncStorage au démarrage
	useEffect(() => {
		const initializeAuth = async () => {
			try {
				const token = await AsyncStorage.getItem('token');
				const email = await AsyncStorage.getItem('email');
				const username = await AsyncStorage.getItem('username');
				const id = await AsyncStorage.getItem('id');

				if (token && email && username && id) {
					// Vérifier si le token est encore valide
					try {
						const decoded = jwtDecode(token);
						const now = Math.floor(Date.now() / 1000);

						if (decoded.exp && decoded.exp > now) {
							// Token valide, restaurer l'état
							dispatch({
								type: 'SET_USER_DATA',
								payload: {
									token,
									email,
									username,
									id: parseInt(id),
								},
							});
						} else {
							// Token expiré, nettoyer
							await AsyncStorage.multiRemove([
								'token',
								'email',
								'username',
								'id',
								'refreshToken',
							]);
							dispatch({ type: 'RESET' });
						}
					} catch (error) {
						// Token invalide, nettoyer
						await AsyncStorage.multiRemove([
							'token',
							'email',
							'username',
							'id',
							'refreshToken',
						]);
						dispatch({ type: 'RESET' });
					}
				}
			} catch (error) {
				console.error(
					"Erreur lors de l'initialisation de l'auth:",
					error
				);
				dispatch({ type: 'RESET' });
			} finally {
				setIsInitialized(true);
			}
		};

		initializeAuth();
	}, []);

	return (
		<AuthContext.Provider value={{ state, dispatch, isInitialized }}>
			{children}
		</AuthContext.Provider>
	);
};
