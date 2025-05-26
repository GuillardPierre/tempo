import { Redirect } from 'expo-router';
import IsConnected from './components/utils/utils';
import { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
	const [isConnected, setIsConnected] = useState<boolean | null>(null);

	useEffect(() => {
		async function checkConnection() {
			const connected = await IsConnected();
			setIsConnected(connected);
		}

		checkConnection();
	}, []);

	// Afficher un indicateur de chargement pendant la vérification
	if (isConnected === null) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator size='large' color='#7B32F5' />
			</View>
		);
	}

	// Rediriger vers la page appropriée
	return isConnected ? (
		<Redirect href={'/screens/Homepage'} />
	) : (
		<Redirect href={'/screens/auth/Login'} />
	);
}
