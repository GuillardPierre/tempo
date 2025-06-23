import React, { useContext } from 'react';
import { useThemeColors } from '@/app/hooks/useThemeColors';
import { StyleSheet, View } from 'react-native';
import { Formik } from 'formik';
import CustomTextInput from '@/app/forms/utils/CustomTextInput';
import TextButton from '../utils/TextButton';
import { router } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { httpPost, updateToken } from '../utils/querySetup';
import ENDPOINTS from '../utils/ENDPOINT';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { loginSchema, LoginFormData } from '@/app/schema/login';
import { AuthContext } from '@/app/context/authContext';

type Props = {
	setSnackBar: (type: 'error' | 'info', message: string) => void;
};

export default function LoginForm({ setSnackBar }: Props) {
	const colors = useThemeColors();
	const context = useContext(AuthContext);
	if (!context)
		throw new Error('AuthContext must be used within an AuthProvider');
	const { dispatch } = context;

	const { mutate: submitLogin, isPending } = useMutation<
		any,
		Error,
		LoginFormData
	>({
		mutationFn: async (formData) => {
			AsyncStorage.clear();
			const response = await httpPost(ENDPOINTS.auth.login, formData, {
				isLogin: true,
			});

			if (!response?.ok) {
				const errorMessage = await response?.text();
				throw new Error(errorMessage || 'Échec de connexion');
			}

			const data = await response.json();
			return data;
		},
		onSuccess: (data) => {
			console.log('Connexion réussie', data);
			dispatch({ type: 'SET_IS_CONNECTED', payload: true });
			dispatch({ type: 'SET_TOKEN', payload: data.token });
			dispatch({ type: 'SET_EMAIL', payload: data.email });
			dispatch({ type: 'SET_USERNAME', payload: data.username });
			dispatch({ type: 'SET_ID', payload: data.id });
			AsyncStorage.setItem('token', data.token);
			AsyncStorage.setItem('refreshToken', data.refreshToken || '');
			updateToken();
			setSnackBar('info', 'Connexion réussie !');
			setTimeout(() => {
				router.replace('/screens/Homepage');
			}, 1500);
		},
		onError: (error) => {
			console.error('Erreur de connexion:', error);
			setSnackBar('error', error.message || 'Erreur de connexion');
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
					<View style={{ width: '90%' }}>
						<CustomTextInput
							name='email'
							label='Adresse email'
							placeholder='Adresse email'
							onChangeText={handleChange('email')}
							onBlur={() => handleBlur('email')}
							value={values.email}
							error={
								touched.email && errors.email
									? errors.email
									: undefined
							}
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
								touched.password && errors.password
									? errors.password
									: undefined
							}
						/>
					</View>
					<TextButton
						style={[
							styles.button,
							{ backgroundColor: colors.secondary },
						]}
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
		width: '72%',
		backgroundColor: '#007BFF',
		padding: 10,
		borderRadius: 5,
		marginTop: 20,
		alignSelf: 'center',
	},
});
