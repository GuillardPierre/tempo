import React from 'react';
import { Pressable, StatusBar, StyleSheet, View } from 'react-native';
import ThemedText from '../components/utils/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../hooks/useThemeColors';
import Header from '../components/Header';
import { useState } from 'react';
import ModalMenu from '../components/Modal';
import Menu from '../components/ModalComponents/Menu';
import { Category } from '../types/worktime';
import { httpDelete } from '../components/utils/querySetup';
import ENDPOINTS from '../components/utils/ENDPOINT';
import MainWrapper from '../components/MainWrapper';
import BlockWrapper from '../components/BlockWrapper';
import TrashSvg from '../components/svg/trash';
import BurgerMenuSvg from '../components/svg/burgerMenu';
import CategoryForm from '../forms/categoryForm';
import ButtonMenu from '../components/ButtonMenu';
import useSnackBar from '../hooks/useSnackBar';
import CustomSnackBar from '../components/utils/CustomSnackBar';
import { useCategoryContext } from '../context/CategoryContext';
export default function Categories() {
	const colors = useThemeColors();
	const [modalVisible, setModalVisible] = useState(false);
	const [modalType, setModalType] = useState<'menu' | 'update' | 'delete' | 'exception'>(
		'menu'
	);
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(
		null
	);

	const { categories, setCategories } = useCategoryContext();
	const { color, open, message, setOpen, setSnackBar } = useSnackBar();

	const resetModalState = () => {
		setModalVisible(false);
		setModalType('menu');
		setSelectedCategory(null);
	};

	const deleteCategory = async (category: Category) => {
		const rep = await httpDelete(
			`${ENDPOINTS.category.root}${category.id}`
		);
		if (rep.ok) {
			setSnackBar('info', 'Catégorie supprimée');
			setCategories(categories.filter((c) => c.id !== category.id));
			resetModalState();
		} else {
			setSnackBar(
				'error',
				'Erreur lors de la suppression de la catégorie'
			);
		}
	};

	const handleButton = (category: Category, type: 'delete' | 'update') => {
		if (type === 'delete') {
			setSelectedCategory(category);
			setModalType('delete');
			setModalVisible(true);
		}
		if (type === 'update') {
			setSelectedCategory(category);
			setModalType('update');
			setModalVisible(true);
		}
	};
	return (
		<>
			<SafeAreaView style={{ backgroundColor: colors.primary, flex: 1 }}>
				<StatusBar
					backgroundColor={colors.primary}
					barStyle='light-content'
				/>
				<Header
					modalVisible={modalVisible}
					setModalVisible={setModalVisible}
					setModalType={setModalType}
				/>
				<ThemedText variant='header1' style={styles.title}>
					Mes categories
				</ThemedText>
				<MainWrapper>
					{categories.length === 0 && (
						<BlockWrapper backgroundColor={colors.primaryLight}>
							<ThemedText>
								Aucune catégorie encore créée. Retournez sur la
								page précédente pour en créer une.
							</ThemedText>
						</BlockWrapper>
					)}
					{categories.map((category) => (
						<BlockWrapper
							backgroundColor={colors.primaryLight}
							key={category.id}
						>
							<ThemedText>{category.name}</ThemedText>
							<View style={styles.icons}>
								<Pressable
									onPress={(e) =>
										handleButton(category, 'delete')
									}
								>
									<TrashSvg />
								</Pressable>
								<Pressable
									onPress={(e) =>
										handleButton(category, 'update')
									}
								>
									<BurgerMenuSvg />
								</Pressable>
							</View>
						</BlockWrapper>
					))}
				</MainWrapper>
				<CustomSnackBar
					color={color}
					message={message}
					open={open}
					setOpen={setOpen}
				/>
			</SafeAreaView>
			<ModalMenu
				modalVisible={modalVisible}
				setModalVisible={setModalVisible}
			>
				{modalType === 'menu' && (
					<Menu setModalVisible={setModalVisible} />
				)}
				{modalType === 'update' && selectedCategory ? (
					<CategoryForm
						category={selectedCategory}
						setModalVisible={setModalVisible}
						onCancel={resetModalState}
						setCategories={setCategories}
					/>
				) : null}
				{modalType === 'delete' && selectedCategory ? (
					<View style={styles.deleteContainer}>
						<ThemedText variant='header2' color='secondaryText'>
							Êtes-vous sûr de vouloir supprimer cette catégorie ?
						</ThemedText>
						<BlockWrapper backgroundColor={colors.error} style={{minHeight: 70}}>
							<ThemedText color='primaryText'>
								Attention toutes les entrées de cette catégorie
								seront supprimées.
							</ThemedText>
						</BlockWrapper>
						<View style={styles.buttonsContainer}>
							<ButtonMenu
								type='round'
								text='Annuler'
								action={() => {
									resetModalState();
								}}
							/>
							<ButtonMenu
								type='round'
								text='Supprimer'
								style={{ backgroundColor: colors.error }}
								action={() => {
									deleteCategory(selectedCategory);
								}}
							/>
						</View>
					</View>
				) : null}
			</ModalMenu>
		</>
	);
}

const styles = StyleSheet.create({
	title: {
		width: '100%',
		textAlign: 'center',
		marginBottom: 12,
	},
	icons: {
		flexDirection: 'row',
		gap: 10,
	},
	deleteContainer: {
		paddingBottom: 50,
		gap: 12,
	},
	buttonsContainer: {
		flexDirection: 'row',
		gap: 10,
		width: '50%',
	},
});
