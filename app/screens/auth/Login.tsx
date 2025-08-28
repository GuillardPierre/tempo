import LoginForm from '@/app/components/forms/LoginForm';
import CustomSnackBar from '@/app/components/utils/CustomSnackBar';
import TextButton from '@/app/components/utils/TextButton';
import ThemedText from '@/app/components/utils/ThemedText';
import useSnackBar from '@/app/hooks/useSnackBar';
import { useThemeColors } from '@/app/hooks/useThemeColors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import {
	SafeAreaView,
	StatusBar,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
} from 'react-native';

export default function Login() {
	const colors = useThemeColors();
	const router = useRouter();
	const { color, open, message, setOpen, setSnackBar } = useSnackBar();

	const getToken = async () => {
		const token = await AsyncStorage.getItem('token');
	};

	useEffect(() => {
		getToken();
	}, []);
	return (
		<SafeAreaView
			style={[
				styles.container,
				{
					backgroundColor: colors.primary,
				},
			]}
		>
			<StatusBar
				backgroundColor={colors.primary}
				barStyle='light-content'
			/>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={styles.keyboardAvoidingView}
			>
				<ThemedText variant='header1' color='primaryText'>
					Bienvenue sur Tempo
				</ThemedText>

				<ThemedText
					style={styles.header}
					variant='body'
					color='primaryText'
				>
					Gérez votre temps efficacement avec un suivi statistique
					tout au long de l'année
				</ThemedText>
				<LoginForm setSnackBar={setSnackBar} />

				<TextButton
					style={styles.button}
					onPress={() => {
						router.push('/screens/auth/Signup');
					}}
					text='Pas encore de compte ?'
				/>
			</KeyboardAvoidingView>
			<CustomSnackBar
				color={color}
				message={message}
				open={open}
				setOpen={setOpen}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	keyboardAvoidingView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	header: {
		fontSize: 18,
		textAlign: 'center',
		marginBlock: 20,
	},
	link: {
		fontWeight: 'bold',
		fontSize: 16,
		padding: 10,
		borderRadius: 5,
		textDecorationLine: 'underline',
		marginTop: 20,
	},
	button: {
		backgroundColor: '#007BFF',
		padding: 10,
		borderRadius: 5,
		marginTop: 20,
	},
});
