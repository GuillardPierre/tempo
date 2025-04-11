import SignupForm from '@/app/components/forms/SignupForm';
import TextButton from '@/app/components/utils/TextButton';
import ThemedText from '@/app/components/utils/ThemedText';
import { useThemeColors } from '@/app/hooks/useThemeColors';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { Snackbar } from 'react-native-paper';

export default function Signup() {
	const [visible, setVisible] = useState(false);
	const [message, setMessage] = useState('');
	const colors = useThemeColors();
	const router = useRouter();

	return (
		<SafeAreaView
			style={[
				styles.container,
				{
					backgroundColor: colors.primary,
				},
			]}
		>
			<StatusBar backgroundColor={colors.primary} barStyle='light-content' />
			<ThemedText variant='header1' color='primaryText'>
				Bienvenue sur Tempos
			</ThemedText>
			<ThemedText style={styles.header} variant='body' color='primaryText'>
				Nous respectons votre vie privée : aucune donnée partagée, suppression
				du compte possible à tout moment.
			</ThemedText>

			<SignupForm setVisible={setVisible} setMessage={setMessage} />
			<TextButton
				style={styles.button}
				onPress={() => {
					// Redirect to Login screen
					router.push('/screens/auth/Login');
				}}
				text='Déjà un compte ?'
			/>
			<Snackbar visible={visible} onDismiss={() => setVisible(false)}>
				{message}
			</Snackbar>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	header: {
		fontSize: 18,
		textAlign: 'center',
		marginBlock: 10,
	},
	button: {
		backgroundColor: '#007BFF',
		padding: 10,
		borderRadius: 5,
		marginTop: 20,
	},
});
