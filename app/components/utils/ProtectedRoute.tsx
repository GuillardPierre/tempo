import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '../../context/authContext';

interface ProtectedRouteProps {
	children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { state, isInitialized } = useAuth();
	const { isConnected } = state;
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

	// Rediriger vers la page de connexion si non connecté
	if (!isConnected) {
		return <Redirect href='/screens/auth/Login' />;
	}

	// Afficher le contenu protégé si connecté
	return <>{children}</>;
}
