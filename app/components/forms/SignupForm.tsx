import { useThemeColors } from '@/app/hooks/useThemeColors';
import { StyleSheet, View, Text } from 'react-native';
import { Formik } from 'formik';
import CustomTextInput from '@/app/forms/utils/CustomTextInput';
import TextButton from '../utils/TextButton';
import { useMutation } from '@tanstack/react-query';
import { httpPost } from '../utils/querySetup';
import ENDPOINTS from '../utils/ENDPOINT';
import { useRouter } from 'expo-router';
import { signupFormSchema, SignupFormData } from '@/app/schema/signup';
import { toFormikValidationSchema } from 'zod-formik-adapter';

type Props = {
	setVisible: (visible: boolean) => void;
	setMessage: (message: string) => void;
};

export default function SignupForm({ setVisible, setMessage }: Props) {
	const router = useRouter();
	const colors = useThemeColors();

	const { mutate: submitSignup, isPending } = useMutation<
		any,
		Error,
		SignupFormData
	>({
		mutationFn: async (formData) => {
			const response = await httpPost(ENDPOINTS.auth.signup, formData);

			if (!response.ok) {
				const errorMessage = await response.text();
				throw new Error(errorMessage || "Échec de l'inscription");
			}

			const data = await response.json();
			return data;
		},
		onSuccess: (data) => {
			console.log('Inscription réussie', data);
			setVisible(true);
			setMessage('Inscription réussie ! Bienvenue sur Tempos.');
			setTimeout(() => {
				router.push('/screens/auth/Login');
			}, 2000);
		},
		onError: (error) => {
			console.error("Erreur d'inscription:", error);
			setVisible(true);
			setMessage(
				error.message || "Échec de l'inscription. Veuillez réessayer."
			);
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
			validationSchema={toFormikValidationSchema(signupFormSchema)}
			onSubmit={(values) => {
				submitSignup(values);
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
						name='username'
						label="Nom d'utilisateur"
						placeholder="Nom d'utilisateur"
						onChangeText={handleChange('username')}
						onBlur={() => handleBlur('username')}
						value={values.username}
						error={
							touched.username && errors.username ? errors.username : undefined
						}
					/>

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

					<CustomTextInput
						name='confirmPassword'
						label='Confirmez votre mot de passe'
						placeholder='Confirmez votre mot de passe'
						onChangeText={handleChange('confirmPassword')}
						onBlur={() => handleBlur('confirmPassword')}
						value={values.confirmPassword}
						secureTextEntry={true}
						error={
							touched.confirmPassword && errors.confirmPassword
								? errors.confirmPassword
								: undefined
						}
					/>

					<View style={[styles.button, { backgroundColor: colors.secondary }]}>
						<TextButton
							onPress={handleSubmit}
							text='Créer un compte'
							isPending={isPending}
						/>
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
