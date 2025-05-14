import React from 'react';
import { StyleSheet, View } from 'react-native';
import ButtonMenu from '../ButtonMenu';
import { deleteToken } from '../utils/utils';
import { router, useSegments } from 'expo-router';

type Props = {
	setModalVisible: (visible: boolean) => void;
};

export default function Menu({ setModalVisible }: Props) {
	const segments = useSegments();
	const nomScreen = segments[segments.length - 1]; // Le dernier segment est souvent le nom du screen
	const isHomepage = nomScreen === 'Homepage';

	return (
		<View style={styles.container}>
			<ButtonMenu
				type='square'
				text={isHomepage ? 'Mes catégories' : 'Mes temps de travail'}
				action={() => {
					if (isHomepage) {
						router.push('/screens/categories');
					} else {
						router.push('/screens/homepage/Homepage');
					}
					setModalVisible(false);
				}}
			/>
			<ButtonMenu type='square' text='Profil' action={() => {}} />
			<ButtonMenu type='square' text='Paramètres' action={() => {}} />
			<ButtonMenu
				type='square'
				text='Se déconnecter'
				action={() => {
					deleteToken().then(() => {
						setModalVisible(false);
						router.push('/screens/auth/Login');
					});
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		padding: 5,
		gap: 10, // Espace entre les boutons
		alignItems: 'center',
	},
});
