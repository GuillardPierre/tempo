import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider } from './context/authContext';

const queryClient = new QueryClient();

export default function RootLayout() {
	return (
		<PaperProvider>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<Stack
						screenOptions={{
							headerShown: false,
						}}
					/>
				</AuthProvider>
			</QueryClientProvider>
		</PaperProvider>
	);
}
