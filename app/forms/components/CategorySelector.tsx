import React from 'react';
import { Text, Vibration } from 'react-native';
import { useThemeColors } from '../../hooks/useThemeColors';
import DropDownPicker from 'react-native-dropdown-picker';
import ButtonMenu from '../../components/ButtonMenu';
import BlockWrapper from '../../components/BlockWrapper';
import ThemedText from '../../components/utils/ThemedText';
import { Category } from '../../types/worktime';

interface CategorySelectorProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	value: string | null;
	categories: Category[];
	onSelectCategory: (category: { id: string; title: string }) => void;
	searchText: string;
	setSearchText: (text: string) => void;
	onCreateCategory: (name: string) => Promise<Category | null>;
	onCategoryCreated: (category: Category) => void;
	error?: string;
	touched?: boolean;
}

export default function CategorySelector({
	open,
	setOpen,
	value,
	categories,
	onSelectCategory,
	searchText,
	setSearchText,
	onCreateCategory,
	onCategoryCreated,
	error,
	touched,
}: CategorySelectorProps) {
	const colors = useThemeColors();

	return (
		<>
			<DropDownPicker
				open={open}
				value={value}
				items={categories.map((c) => ({
					label: c.name,
					value: String(c.id),
				}))}
				setOpen={setOpen}
				setValue={(callback) => {
					const currentValue = callback(value);
					return currentValue;
				}}
				onSelectItem={(item) => {
					Vibration.vibrate(50);
					if (item && item.value) {
						const itemValue = item.value.toString();
						const category = categories.find(
							(c) => String(c.id) === itemValue
						);
						if (category) {
							onSelectCategory({
								id: itemValue,
								title: category.name,
							});
						}
					}
				}}
				searchable={true}
				searchPlaceholder='Tapez pour rechercher ou créer une catégorie'
				onChangeSearchText={(text) => {
					setSearchText(text);
				}}
				placeholder='Sélectionnez une catégorie'
				style={{
					borderWidth: 3,
					borderRadius: 12,
					marginBottom: 2,
					width: '100%',
					borderColor: colors.primary,
				}}
				dropDownContainerStyle={{
					borderWidth: 3,
					borderRadius: 4,
					width: '100%',
					backgroundColor: colors.background,
					borderColor: colors.primary,
				}}
				listMode='MODAL'
				modalAnimationType='slide'
				placeholderStyle={{ fontWeight: 500 }}
				modalContentContainerStyle={{
					borderWidth: 3,
					borderRadius: 4,
					height: '50%',
					width: '100%',
					marginLeft: 'auto',
					marginRight: 'auto',
					backgroundColor: colors.background,
					borderColor: colors.secondary,
				}}
				ListEmptyComponent={(props) =>
					searchText.length > 0 ? (
						<ButtonMenu
							style={{
								width: '80%',
								marginLeft: 'auto',
								marginRight: 'auto',
							}}
							type='round'
							text={`Créer "${searchText}"`}
							action={async () => {
								const newCategory = await onCreateCategory(searchText);

								if (newCategory) {
									onCategoryCreated(newCategory);
									onSelectCategory({
										id: String(newCategory.id),
										title: newCategory.name,
									});
									setSearchText(newCategory.name);
									setTimeout(() => {
										setOpen(false);
									}, 100);
								}
							}}
						/>
					) : (
						<BlockWrapper
							style={{ maxHeight: 100 }}
							backgroundColor={colors.primaryLight}
						>
							<ThemedText>
								Créez une catégorie en tapant dans la barre de
								recherche
							</ThemedText>
						</BlockWrapper>
					)
				}
			/>

			{touched && error && (
				<Text
					style={{
						fontSize: 12,
						marginBottom: 10,
						paddingLeft: 5,
						color: colors.primary,
					}}
				>
					{error}
				</Text>
			)}
		</>
	);
}
