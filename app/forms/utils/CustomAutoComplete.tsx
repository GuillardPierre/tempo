import { StyleSheet, View, Text, Pressable } from 'react-native';
import {
	AutocompleteDropdown,
	AutocompleteDropdownItem,
	IAutocompleteDropdownRef,
} from 'react-native-autocomplete-dropdown';

import { useCallback, useRef, useState, useEffect } from 'react';
import { useThemeColors } from '../../hooks/useThemeColors';
import ThemedText from '../../components/utils/ThemedText';

// Définir l'interface pour nos données de catégorie
interface CategoryItem {
	id: string | null;
	title: string;
}

// Étendre l'interface pour inclure notre propriété personnalisée
interface ExtendedAutocompleteItem
	extends Omit<AutocompleteDropdownItem, 'id'> {
	id: string | null;
	realTitle?: string;
}

type Props = {
	label: string;
	onChange?: (text: string) => void;
	onSelectItem?: (item: AutocompleteDropdownItem | null) => void;
	onBlur?: () => void;
};

export default function CustomAutocomplete({
	label,
	onChange,
	onBlur,
	onSelectItem,
}: Props) {
	const colors = useThemeColors();
	// Mise à jour du type pour selectedItem
	const [selectedItem, setSelectedItem] =
		useState<ExtendedAutocompleteItem | null>(null);
	const [suggestionsList, setSuggestionsList] = useState<
		ExtendedAutocompleteItem[] | null
	>(null);
	// Utiliser le type CategoryItem pour data
	const [data, setData] = useState<CategoryItem[]>(initialData);
	const dropdownController = useRef<IAutocompleteDropdownRef | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [inputText, setInputText] = useState('');
	const [showAddOption, setShowAddOption] = useState(false);

	// Gérer la saisie de texte dans l'autocomplete
	const handleChangeText = (text: string) => {
		// Ne pas mettre à jour inputText ici - laisser le dropdown gérer son état interne
		getSuggestions(text);
		setInputText(text); // Nécessaire pour emptyResultText et le bouton d'ajout

		if (onChange) {
			onChange(text);
		}

		const exists = data.some(
			(item) => item.title.toLowerCase() === text.toLowerCase()
		);

		setShowAddOption(!exists && text.length > 0);
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

			// Si aucun résultat, montrer l'option pour créer une nouvelle catégorie
			if (filtered.length === 0 && q.length > 0) {
				setSuggestionsList([
					{
						id: 'new-category',
						title: `Créer "${q}"`,
						realTitle: q,
					},
				]);
			} else {
				setSuggestionsList(filtered as ExtendedAutocompleteItem[]);
			}
		},
		[data]
	);

	// Gérer la sélection d'un élément (existant ou nouveau)
	const handleSelectItem = (item: ExtendedAutocompleteItem | null) => {
		if (item?.id === 'new-category') {
			const realTitle = item.realTitle || '';
			createNewCategory(realTitle);
			return;
		}

		setSelectedItem(item);
		// Utiliser le contrôleur pour mettre à jour le texte
		dropdownController.current?.setInputText(item?.title || '');

		if (onSelectItem) {
			// TypeScript cast pour satisfaire l'interface attendue par le parent
			onSelectItem(item as AutocompleteDropdownItem);
		}
	};

	// Créer une nouvelle catégorie
	const createNewCategory = (title: string) => {
		if (!title || title.trim() === '') return;

		// Utilisez null comme ID pour les nouvelles catégories au lieu de générer un ID
		const newCategory: CategoryItem = { id: null, title: title.trim() };

		// Ajouter à la liste de données
		setData((prevData) => [...prevData, newCategory]);

		// Sélectionner la nouvelle catégorie (avec conversion de type)
		setSelectedItem(newCategory as ExtendedAutocompleteItem);

		// Mettre à jour via le contrôleur
		dropdownController.current?.setInputText(newCategory.title);
		dropdownController.current?.close(); // Fermer la liste de suggestions

		// Notifier le parent avec la nouvelle catégorie
		if (onSelectItem) {
			onSelectItem(newCategory as AutocompleteDropdownItem);
		}
	};

	const onOpenSuggestionsList = useCallback(
		(isOpened: boolean) => {
			setIsOpen(isOpened);
			if (isOpened) {
				setSuggestionsList(data as ExtendedAutocompleteItem[]);
			}
		},
		[data]
	);

	// ...le reste du composant reste inchangé
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
				emptyResultText={`Créer "${inputText}"`}
				onClear={() => {
					setShowAddOption(false);
				}}
				suggestionsListTextStyle={{
					color: colors.primaryText,
				}}
			/>

			{/* {showAddOption && !isOpen && (
				<Pressable
					style={[styles.addButton, { backgroundColor: colors.secondary }]}
					onPress={() => createNewCategory(inputText)}
				>
					<ThemedText style={styles.addButtonText}>
						Ajouter "{inputText}"
					</ThemedText>
				</Pressable>
			)} */}
		</View>
	);
}

// Données de base
const initialData: CategoryItem[] = [
	{ id: '1', title: 'Ne pas tester pour poster' },
];

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
