import { StyleSheet, View, Text } from 'react-native';
import {
  AutocompleteDropdown,
  AutocompleteDropdownItem,
  IAutocompleteDropdownRef,
} from 'react-native-autocomplete-dropdown';

import { useCallback, useRef, useState, useEffect } from 'react';
import { useThemeColors } from '../../hooks/useThemeColors';
import ThemedText from '../../components/utils/ThemedText';

const data = [
  { id: '1', title: 'Alpha' },
  { id: '2', title: 'Beta' },
  { id: '3', title: 'Gamma' },
];

type Props = {
  label: string;
};

export default function CustomAutocomplete({ label }: Props) {
  const colors = useThemeColors();
  const [selectedItem, setSelectedItem] =
    useState<AutocompleteDropdownItem | null>(null);
  const [suggestionsList, setSuggestionsList] = useState<
    AutocompleteDropdownItem[] | null
  >(null);
  const dropdownController = useRef<IAutocompleteDropdownRef | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(data[0].title);

  const getSuggestions = useCallback((q: string) => {
    const filterToken = q.toLowerCase();
    if (q === '') {
      setSuggestionsList(data);
      return;
    }
    const filtered = data.filter((item) =>
      item.title.toLowerCase().includes(filterToken)
    );
    setSuggestionsList(filtered);
  }, []);

  const onOpenSuggestionsList = useCallback((isOpened: boolean) => {
    setIsOpen(isOpened);
    if (isOpened) {
      setSuggestionsList(data);
    }
  }, []);

  return (
    <View style={styles.dropdownContainer}>
      <ThemedText style={[styles.label, { color: colors.secondaryText }]}>
        {label}
      </ThemedText>
      <AutocompleteDropdown
        clearOnFocus={false}
        closeOnBlur={true}
        closeOnSubmit={false}
        controller={(controller) => {
          dropdownController.current = controller;
        }}
        dataSet={suggestionsList}
        direction='up'
        onOpenSuggestionsList={onOpenSuggestionsList}
        suggestionsListMaxHeight={200}
        inputHeight={50}
        textInputProps={{
          placeholder: 'Classe, Préparation, Correction, ...',
          autoCorrect: false,
          autoCapitalize: 'none',
          style: {
            color: colors.primaryText,
            fontWeight: 'bold',
            fontSize: 18,
            width: '118%',
            backgroundColor: colors.primaryLight,
          },
          placeholderTextColor: colors.primaryText,
        }}
        containerStyle={{
          borderWidth: 3,
          borderStyle: 'solid',
          borderColor: '#8955FD',
          borderRadius: 4,
        }}
        suggestionsListContainerStyle={{
          backgroundColor: colors.primaryLight,
        }}
        renderItem={(item) => (
          <Text style={[styles.suggestionItem, { color: colors.primaryText }]}>{item.title}</Text>
        )}
        emptyResultText="Création d'une nouvelle catégorie"
        suggestionsListTextStyle={{
          color: colors.primaryText
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 5,
  },
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 50,
    paddingVertical: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dropdownContainer: {
    width: '100%',
    position: 'relative',
    elevation: 8,
  },
  inputContainer: {
    backgroundColor: 'transparent',
    borderRadius: 4,
  },
  suggestionsContainer: {
    marginTop: 5,
    borderRadius: 4,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    borderWidth: 3,
    borderStyle: 'solid',
    borderColor: '#8955FD',
  },
  suggestionItem: {
    padding: 15,
    marginVertical: 0,
    borderRadius: 4,
  },
});
