import React, { useState } from 'react';
import { View } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, StyleSheet } from 'react-native';
import ThemedText from '../components/utils/ThemedText';
import { useAuth } from '../context/authContext';
import ButtonMenu from '../components/ButtonMenu';
import Header from '../components/Header';
import ModalMenu from '../components/Modal';
import Menu from '../components/ModalComponents/Menu';
import MainWrapper from '../components/MainWrapper';
import BlockWrapper from '../components/BlockWrapper';
import { httpDelete } from '../components/utils/querySetup';
import ENDPOINTS from '../components/utils/ENDPOINT';
import CustomSnackBar from '../components/utils/CustomSnackBar';
import useSnackBar from '../hooks/useSnackBar';
import { router } from 'expo-router';
import { deleteToken } from '../components/utils/utils';
import { ModalType } from '../types/modal';

export default function Profile() {
	const colors = useThemeColors();
	const { state, dispatch } = useAuth();
	const { email, username, id } = state;
	const { color, open, message, setOpen, setSnackBar } = useSnackBar();

	const [modalVisible, setModalVisible] = useState(false);
	const [modalType, setModalType] = useState<ModalType>('menu');

	const deleteAccount = async () => {
		try {
			const rep = await httpDelete(`${ENDPOINTS.auth.delete}/${id}`);
			if (!rep.ok) {
				const error = await rep.json();
				throw new Error(error.message);
			}
			await deleteToken();
			dispatch({ type: 'RESET' });
			setSnackBar('info', 'Compte supprimé avec succès');
			setTimeout(() => {
				router.replace('/screens/auth/Login');
			}, 1500);
		} catch (error) {
			console.error(error);
			setSnackBar('error', 'Erreur lors de la suppression du compte');
		}
	};

	return (
		<>
			<SafeAreaView
				style={[styles.container, { backgroundColor: colors.primary }]}
			>
				<StatusBar
					backgroundColor={colors.primary}
					barStyle='light-content'
				/>
				<Header
					modalVisible={modalVisible}
					setModalVisible={setModalVisible}
					setModalType={setModalType}
				/>
				<MainWrapper style={styles.mainWrapper}>
					<ThemedText variant='header1' color='secondaryText'>
						Profil
					</ThemedText>
					<View style={styles.infoBlock}>
						<ThemedText variant='header2' color='secondaryText'>
							Vous êtes connecté en tant que :{' '}
						</ThemedText>
						<ThemedText variant='body' color='secondaryText'>
							Email: {email}
						</ThemedText>
						<ThemedText variant='body' color='secondaryText'>
							Pseudo: {username}
						</ThemedText>
						<BlockWrapper backgroundColor={'#056CF6'}>
							<ThemedText variant='body' color='primaryText'>
								Cette application est un projet personnel, vos
								données ne sont pas partagées / vendues.
							</ThemedText>
						</BlockWrapper>
						<ButtonMenu
							style={{ backgroundColor: colors.error }}
							text='Supprimer le compte'
							type='round'
							action={() => {
								setModalType('delete');
								setModalVisible(true);
							}}
						/>
					</View>
				</MainWrapper>
			</SafeAreaView>
			<ModalMenu
				modalVisible={modalVisible}
				setModalVisible={setModalVisible}
			>
				{modalType === 'menu' && (
					<Menu setModalVisible={setModalVisible} />
				)}
				{modalType === 'delete' && (
					<View style={styles.deleteModalContainer}>
						<ThemedText variant='header1' color='secondaryText'>
							Êtes-vous sûr de vouloir supprimer votre compte ?
						</ThemedText>
						<BlockWrapper
							style={{ minHeight: 70 }}
							backgroundColor={'#056CF6'}
						>
							<ThemedText variant='body' color='primaryText'>
								Si vous avez des retours, contactez moi sur
								pguillard95@gmail.com
							</ThemedText>
						</BlockWrapper>
						<View style={styles.deleteModalButtons}>
							<ButtonMenu
								text='Annuler'
								type='round'
								action={() => setModalVisible(false)}
							/>
							<ButtonMenu
								text='Supprimer le compte'
								type='round'
								style={{ backgroundColor: colors.error }}
								action={deleteAccount}
							/>
						</View>
					</View>
				)}
			</ModalMenu>
			<CustomSnackBar
				color={color}
				message={message}
				open={open}
				setOpen={setOpen}
			/>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	mainWrapper: {
		marginTop: '50%',
	},
	infoBlock: {
		gap: 10,
	},
	deleteModalContainer: {
		paddingBottom: 80,
		gap: 10,
	},
	deleteModalButtons: {
		flexDirection: 'row',
		gap: 10,
		width: '50%',
	},
});
