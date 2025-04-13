import { TextInput } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { useThemeColors } from '../../hooks/useThemeColors';
import ThemedText from '../../components/utils/ThemedText';

type Props = {
	label?: string;
	name: string; // Nom du champ pour Formik
	value: string;
	onChangeText: (text: string) => void;
	onBlur?: () => void; // Gestion du blur pour Formik
	placeholder?: string;
	secureTextEntry?: boolean;
	error?: string | false; // Message d'erreur
	style?: StyleSheet.NamedStyles<any>;
};

export default function CustomTextInput({
	label,
	name,
	value,
	onChangeText,
	onBlur,
	placeholder,
	secureTextEntry = false,
	error,
	style,
}: Props) {
	const colors = useThemeColors();

	return (
		<View style={[styles.container, style]}>
			{label && (
				<ThemedText style={[styles.label, { color: colors.primaryText }]}>
					{label}
				</ThemedText>
			)}
			<TextInput
				style={[
					styles.input,
					{
						backgroundColor: colors.primaryLight,
						color: colors.primaryText,
						borderColor: error ? '#pgB22222' : '#8955FD',
					},
				]}
				value={value}
				onChangeText={onChangeText}
				onBlur={onBlur}
				placeholder={placeholder}
				placeholderTextColor={colors.primaryText}
				secureTextEntry={secureTextEntry}
			/>
			{error && (
				<ThemedText style={[styles.error, { color: 'red' }]}>
					{error}
				</ThemedText>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		marginBottom: 15, // Espace entre les champs
	},
	label: {
		fontSize: 16,
		fontWeight: 'bold',
		paddingLeft: 5,
		marginBottom: 5,
	},
	input: {
		width: '100%',
		borderWidth: 3,
		borderStyle: 'solid',
		borderRadius: 4,
		padding: 10,
		fontSize: 18,
		fontWeight: 'bold',
	},
	error: {
		fontSize: 14,
		marginTop: 5,
		paddingLeft: 5,
	},
});
