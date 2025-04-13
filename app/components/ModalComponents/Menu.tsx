import React from 'react';
import ButtonMenu from '../ButtonMenu';
import { deleteToken } from '../utils/utils';
import { router } from 'expo-router';

type Props = {
	setModalVisible: (visible: boolean) => void;
};

export default function Menu({ setModalVisible }: Props) {
	return (
		<>
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
		</>
	);
}
