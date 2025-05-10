import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider } from 'react-native-paper';

const queryClient = new QueryClient();

export default function RootLayout() {
	return (
			<PaperProvider>
				<QueryClientProvider client={queryClient}>
					<Stack
					screenOptions={{
						headerShown: false,
					}}
				/>
			</QueryClientProvider>
		</PaperProvider>
	);
}
