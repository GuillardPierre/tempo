import { useThemeColors } from '@/app/hooks/useThemeColors';
import { StyleSheet, View } from 'react-native';
import { Formik } from 'formik';
import CustomTextInput from '@/app/forms/utils/CustomTextInput';
import TextButton from '../utils/TextButton';
import { router } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { httpPost } from '../utils/querySetup';
import ENDPOINTS from '../utils/ENDPOINT';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { loginSchema, LoginFormData } from '@/app/schema/login';

type Props = {
	setVisible: (visible: boolean) => void;
	setMessage: (message: string) => void;
};

export default function LoginForm({ setVisible, setMessage }: Props) {
	const colors = useThemeColors();

	const { mutate: submitLogin, isPending } = useMutation<
		any,
		Error,
		LoginFormData
	>({
		mutationFn: async (formData) => {
			const response = await httpPost(ENDPOINTS.auth.login, formData);

			if (!response.ok) {
				const errorMessage = await response.text();
				throw new Error(errorMessage || 'Échec de connexion');
			}

			const data = await response.json();
			return data;
		},
		onSuccess: (data) => {
			console.log('Connexion réussie', data);
			AsyncStorage.setItem('token', data.token);
			AsyncStorage.setItem('refreshToken', data.refreshToken || '');
			setVisible(true);
			setMessage('Connexion réussie ! Bienvenue sur Tempos.');
			setTimeout(() => {
				router.replace('/');
			}, 2000);
		},
		onError: (error) => {
			console.error('Erreur de connexion:', error);
			setVisible(true);
			setMessage(error.message || 'Échec de connexion. Veuillez réessayer.');
		},
	});

	return (
		<Formik
			initialValues={{ email: '', password: '' }}
			validationSchema={toFormikValidationSchema(loginSchema)}
			onSubmit={(values) => {
				submitLogin(values);
			}}
		>
			{({
				handleChange,
				handleBlur,
				handleSubmit,
				values,
				errors,
				touched,
			}) => (
				<>
					<CustomTextInput
						name='email'
						label='Adresse email'
						placeholder='Adresse email'
						onChangeText={handleChange('email')}
						onBlur={() => handleBlur('email')}
						value={values.email}
						error={touched.email && errors.email ? errors.email : undefined}
					/>
					<CustomTextInput
						name='password'
						label='Mot de passe'
						placeholder='Mot de passe'
						onChangeText={handleChange('password')}
						onBlur={() => handleBlur('password')}
						value={values.password}
						secureTextEntry={true}
						error={
							touched.password && errors.password ? errors.password : undefined
						}
					/>
					<TextButton
						style={[styles.button, { backgroundColor: colors.secondary }]}
						onPress={handleSubmit}
						text='Se connecter'
						isPending={isPending}
					/>
				</>
			)}
		</Formik>
	);
}

const styles = StyleSheet.create({
	input: {
		height: 40,
		borderColor: 'gray',
		borderWidth: 1,
		marginBottom: 12,
		paddingLeft: 8,
		borderRadius: 5,
	},
	button: {
		backgroundColor: '#007BFF',
		padding: 10,
		borderRadius: 5,
		marginTop: 20,
	},
});
