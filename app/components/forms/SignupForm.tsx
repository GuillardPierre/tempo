import { useThemeColors } from '@/app/hooks/useThemeColors';
import { StyleSheet, View } from 'react-native';
import { Formik } from 'formik';
import CustomTextInput from '@/app/forms/utils/CustomTextInput';
import TextButton from '../utils/TextButton';

export default function SignupForm() {
	const colors = useThemeColors();

	return (
		<Formik
			initialValues={{ email: '', password: '', confirmPassword: '' }}
			onSubmit={(values) => {
				console.log(values);
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
					<CustomTextInput
						name='confirmPassword'
						label='Confirmez votre mot de passe'
						placeholder='Confirmez votre mot de passe'
						onChangeText={handleChange('confirmPassword')}
						value={values.confirmPassword}
					/>
					<View style={[styles.button, { backgroundColor: colors.secondary }]}>
						<TextButton onPress={handleSubmit} text='Se connecter' />
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
