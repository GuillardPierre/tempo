import { Stack } from 'expo-router';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider } from 'react-native-paper';

const queryClient = new QueryClient();

export default function RootLayout() {
	return (
		<PaperProvider>
			<QueryClientProvider client={queryClient}>
				<AutocompleteDropdownContextProvider>
					<Stack
						screenOptions={{
							headerShown: false,
						}}
					/>
				</AutocompleteDropdownContextProvider>
			</QueryClientProvider>
		</PaperProvider>
	);
}
