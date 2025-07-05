import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from './context/authContext';

export default function Index() {
	const { state, isInitialized } = useAuth();
	const { isConnected } = state;

	// Afficher un indicateur de chargement pendant l'initialisation
	if (!isInitialized) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<ActivityIndicator size='large' color='#7B32F5' />
			</View>
		);
	}

	// Rediriger vers la page appropriée
	return isConnected ? (
		<Redirect href='/screens/Homepage' />
	) : (
		<Redirect href='/screens/auth/Login' />
	);
}
