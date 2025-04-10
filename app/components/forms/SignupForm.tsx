import { useThemeColors } from '@/app/hooks/useThemeColors';
import { StyleSheet, View } from 'react-native';
import { Formik } from 'formik';
import CustomTextInput from '@/app/forms/utils/CustomTextInput';
import TextButton from '../utils/TextButton';
import { useMutation, useQuery } from '@tanstack/react-query';

type SignupFormData = {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
};

export default function SignupForm() {
	const colors = useThemeColors();

	const { mutate: submitSignup, isPending } = useMutation<
		any,
		Error,
		SignupFormData
	>({
		mutationFn: async (formData) => {
			const response = await fetch('http://10.0.2.2:8080/user/signup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
				// Récupérer le message d'erreur en texte brut
				const errorMessage = await response.text();
				throw new Error(errorMessage || "Échec de l'inscription");
			}

			// Seulement parser comme JSON si la réponse est réussie
			const data = await response.json();
			return data;
		},
		onSuccess: (data) => {
			console.log('Inscription réussie', data);
		},
		onError: (error) => {
			console.error("Erreur d'inscription:", error);
		},
	});

	return (
		<Formik
			initialValues={{
				username: '',
				email: '',
				password: '',
				confirmPassword: '',
			}}
			onSubmit={(values) => {
				submitSignup(values);
			}}
		>
			{({ handleChange, handleBlur, handleSubmit, values }) => (
				<>
					<CustomTextInput
						name='username'
						label="Nom d'utilisateur"
						placeholder="Nom d'utilisateur"
						onChangeText={handleChange('username')}
						value={values.username}
					/>
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
					<CustomTextInput
						name='confirmPassword'
						label='Confirmez votre mot de passe'
						placeholder='Confirmez votre mot de passe'
						onChangeText={handleChange('confirmPassword')}
						value={values.confirmPassword}
					/>
					<View style={[styles.button, { backgroundColor: colors.secondary }]}>
						<TextButton onPress={handleSubmit} text='Créer un compte' />
					</View>
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
