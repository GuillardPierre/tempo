import { Stack } from 'expo-router';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';

export default function RootLayout() {
  return (
    <AutocompleteDropdownContextProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </AutocompleteDropdownContextProvider>
  );
}
