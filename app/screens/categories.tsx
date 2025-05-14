import { StatusBar, View } from 'react-native';
import ThemedText from '../components/utils/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../hooks/useThemeColors';
import Header from '../components/Header';
import { useEffect, useState } from 'react';
import ModalMenu from '../components/Modal';
import Menu from '../components/ModalComponents/Menu';
import { Category } from '../types/worktime';
import { httpGet } from '../components/utils/querySetup';
import ENDPOINTS from '../components/utils/ENDPOINT';

export default function Categories() {
	const colors = useThemeColors();
	const [modalVisible, setModalVisible] = useState(false);
	const [modalType, setModalType] = useState<'menu' | 'update'>('menu');
	const [categories, setCategories] = useState<Category[]>([]);

	useEffect(() => {
		const fetchCategories = async () => {
			const categories = await httpGet(`${ENDPOINTS.category.all}`);
			if (categories.ok) {
				const data = await categories.json();
				setCategories(data);
			}
		};
		fetchCategories();
	}, []);

	console.log(categories);

	return (
		<SafeAreaView style={{ backgroundColor: colors.primary, flex: 1 }}>
			<StatusBar backgroundColor={colors.primary} barStyle='light-content' />
			<Header
				modalVisible={modalVisible}
				setModalVisible={setModalVisible}
				setModalType={setModalType}
			/>
			<ThemedText>Categories</ThemedText>
			<ModalMenu modalVisible={modalVisible} setModalVisible={setModalVisible}>
				{modalType === 'menu' && <Menu setModalVisible={setModalVisible} />}
			</ModalMenu>
		</SafeAreaView>
	);
}
