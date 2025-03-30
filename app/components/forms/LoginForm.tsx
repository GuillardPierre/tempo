import { useThemeColors } from '@/app/hooks/useThemeColors';
import { Button, StyleSheet, TextInput, View } from 'react-native';
import { Formik } from 'formik';
import CustomTextInput from '@/app/forms/utils/CustomTextInput';
import TextButton from '../utils/TextButton';
import { useRouter } from 'expo-router';

export default function LoginForm() {
	const colors = useThemeColors();
	const router = useRouter();

	return (
		<Formik
			initialValues={{ email: '', password: '' }}
			onSubmit={(values) => {
				console.log(values);
				router.push('../screens/index.tsx');
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
