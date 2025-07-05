import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider } from './context/authContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const queryClient = new QueryClient();

export default function RootLayout() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
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
		</GestureHandlerRootView>
	);
}
