import React from 'react';
import { StyleSheet, View } from 'react-native';
import ButtonMenu from '../ButtonMenu';
import { deleteToken } from '../utils/utils';
import { router } from 'expo-router';

type Props = {
	setModalVisible: (visible: boolean) => void;
};

export default function Menu({ setModalVisible }: Props) {
	return (
		<View style={styles.container}>
			<ButtonMenu type='square' text='Profil' action={() => {}} />
			<ButtonMenu type='square' text='Paramètres' action={() => {}} />
			<ButtonMenu
				type='square'
				text='Aide'
				action={() => {
					console.log('coucou');
				}}
			/>
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
