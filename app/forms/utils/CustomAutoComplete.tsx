import { StyleSheet, View, Text } from 'react-native';
import {
  AutocompleteDropdown,
  AutocompleteDropdownItem,
  IAutocompleteDropdownRef,
} from 'react-native-autocomplete-dropdown';

import { useCallback, useRef, useState, useEffect } from 'react';
import { useThemeColors } from '../../hooks/useThemeColors';
import ThemedText from '../../components/utils/ThemedText';
import CreateCategoryButton from './CreateCategoryButton';

// Définir l'interface pour nos données de catégorie
interface CategoryItem {
  id: string | null;
  title: string;
}

// Interface pour les catégories provenant du backend
interface BackendCategory {
  id: number;
  name: string;
}

// Étendre l'interface pour inclure notre propriété personnalisée
interface ExtendedAutocompleteItem
  extends Omit<AutocompleteDropdownItem, 'id'> {
  id: string | null;
}

type Props = {
  label: string;
  onChange?: (text: string) => void;
  onSelectItem?: (item: AutocompleteDropdownItem | null) => void;
  onBlur?: () => void;
  initialData?: CategoryItem[]; // Données initiales pour l'autocomplete
  onCategoryCreated?: (category: BackendCategory) => void; // Callback pour la création réussie
};

export default function CustomAutocomplete({
  label,
  onChange,
  onBlur,
  onSelectItem,
  initialData = [],
  onCategoryCreated,
}: Props) {
  const colors = useThemeColors();
  const [selectedItem, setSelectedItem] =
    useState<ExtendedAutocompleteItem | null>(null);
  const [suggestionsList, setSuggestionsList] = useState<
    ExtendedAutocompleteItem[] | null
  >(null);
  const [data, setData] = useState<CategoryItem[]>(initialData);
  const dropdownController = useRef<IAutocompleteDropdownRef | null>(null);
  const [inputText, setInputText] = useState('');
  const [showCreateButton, setShowCreateButton] = useState(false);

  // Mettre à jour les données lorsque initialData change
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setData(initialData);
    }
  }, [initialData]);

  // Gérer la saisie de texte dans l'autocomplete
  const handleChangeText = (text: string) => {
    // Mettre à jour les suggestions
    getSuggestions(text);
    setInputText(text);

    if (onChange) {
      onChange(text);
    }

    // Vérifier si le texte existe déjà parmi les catégories
    const exists = data.some(
      (item) => item.title.toLowerCase() === text.toLowerCase()
    );

    // Afficher le bouton de création seulement si le texte ne correspond à aucune catégorie
    setShowCreateButton(!exists && text.length > 0);
  };

  // Fonction pour obtenir les suggestions basées sur la saisie
  const getSuggestions = useCallback(
    (q: string) => {
      const filterToken = q.toLowerCase();
      if (q === '') {
        setSuggestionsList(data as ExtendedAutocompleteItem[]);
        return;
      }
      const filtered = data.filter((item) =>
        item.title.toLowerCase().includes(filterToken)
      );
      setSuggestionsList(filtered as ExtendedAutocompleteItem[]);
    },
    [data]
  );

  // Gérer la sélection d'un élément
  const handleSelectItem = (item: ExtendedAutocompleteItem | null) => {
    setSelectedItem(item);
    if (item) {
      dropdownController.current?.setInputText(item.title || '');
    }

    if (onSelectItem) {
      onSelectItem(item as AutocompleteDropdownItem);
    }

    // Masquer le bouton de création si un élément est sélectionné
    setShowCreateButton(false);
  };

  // Gérer la création réussie d'une catégorie
  const handleCategoryCreated = (category: BackendCategory) => {
    // Créer un nouvel item pour l'autocomplete avec l'ID converti en string
    const newCategory: CategoryItem = {
      id: String(category.id),
      title: category.name,
    };

    // Ajouter à la liste de données
    setData((prevData) => [...prevData, newCategory]);

    // Sélectionner la nouvelle catégorie
    const newItem: ExtendedAutocompleteItem = {
      id: String(category.id),
      title: category.name,
    };
    setSelectedItem(newItem);

    // Mettre à jour le texte dans le contrôleur
    dropdownController.current?.setInputText(category.name);

    // Masquer le bouton de création
    setShowCreateButton(false);

    // Notifier le parent si le callback est fourni
    if (onSelectItem) {
      onSelectItem(newItem as AutocompleteDropdownItem);
    }

    // Appeler le callback de création si fourni
    if (onCategoryCreated) {
      onCategoryCreated(category);
    }
  };

  const onOpenSuggestionsList = useCallback(
    (isOpened: boolean) => {
      if (isOpened) {
        setSuggestionsList(data as ExtendedAutocompleteItem[]);
      }
    },
    [data]
  );

  return (
    <View style={styles.dropdownContainer}>
      <ThemedText style={[styles.label, { color: colors.secondaryText }]}>
        {label}
      </ThemedText>
      <AutocompleteDropdown
        onChangeText={handleChangeText}
        onSelectItem={handleSelectItem}
        clearOnFocus={false}
        closeOnBlur={true}
        closeOnSubmit={false}
        controller={(controller) => {
          dropdownController.current = controller;
        }}
        dataSet={suggestionsList as AutocompleteDropdownItem[] | null}
        direction='up'
        onOpenSuggestionsList={onOpenSuggestionsList}
        suggestionsListMaxHeight={200}
        inputHeight={40}
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
        renderItem={(item: ExtendedAutocompleteItem) => (
          <Text
            style={[
              styles.suggestionItem,
              {
                color: colors.primaryText,
                fontWeight: item.id === 'new-category' ? 'bold' : 'normal',
                borderColor: colors.primary,
                borderWidth: 3,
              },
            ]}
          >
            {item.title}
          </Text>
        )}
        onClear={() => {
          setShowCreateButton(false);
        }}
        suggestionsListTextStyle={{
          color: colors.primaryText,
        }}
      />

      {/* Bouton externe pour créer une nouvelle catégorie */}
      {showCreateButton && (
        <CreateCategoryButton
          categoryName={inputText}
          onSuccess={handleCategoryCreated}
        />
      )}
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
  addButton: {
    marginTop: 5,
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  addButtonText: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
