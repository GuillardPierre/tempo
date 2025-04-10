import { useThemeColors } from '@/app/hooks/useThemeColors';
import { Button, StyleSheet, TextInput, View } from 'react-native';
import { Formik } from 'formik';
import CustomTextInput from '@/app/forms/utils/CustomTextInput';
import TextButton from '../utils/TextButton';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { ActivityIndicator } from 'react-native-paper';

type LoginFormData = {
	email: string;
	password: string;
};

export default function LoginForm() {
	const colors = useThemeColors();

	const { mutate: submitLogin, isPending } = useMutation<
		any,
		Error,
		LoginFormData
	>({
		mutationFn: async (formData) => {
			const response = await fetch('http://10.0.2.2:8080/user/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
				const errorMessage = await response.text();
				throw new Error(errorMessage || "Échec de l'inscription");
			}

			const data = await response.json();
			return data;
		},
		onSuccess: (data) => {
			console.log('Connexion réussie', data);
		},
		onError: (error) => {
			console.error('Erreur de connexion:', error);
		},
	});

	return (
		<Formik
			initialValues={{ email: '', password: '' }}
			onSubmit={(values) => {
				console.log('LoginForm values:', values);
				submitLogin(values);
			}}
		>
			{({ handleChange, handleBlur, handleSubmit, values }) => (
				<>
					<CustomTextInput
						name='email'
						label='Adresse email'
						placeholder='Adresse email'
						onChangeText={handleChange('email')}
						value={values.email}
					/>
					<CustomTextInput
						name='password'
						label='Mot de passe'
						placeholder='Mot de passe'
						onChangeText={handleChange('password')}
						value={values.password}
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
