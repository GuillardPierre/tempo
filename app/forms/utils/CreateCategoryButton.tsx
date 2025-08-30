import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { httpPost } from '../../components/utils/querySetup';
import ENDPOINTS from '../../components/utils/ENDPOINT';
import ThemedText from '../../components/utils/ThemedText';
import { useThemeColors } from '../../hooks/useThemeColors';
import { Ionicons } from '@expo/vector-icons';

interface Props {
	categoryName: string;
	onSuccess: (category: { id: number; name: string }) => void;
	onError?: (error: Error) => void;
}

export default function CreateCategoryButton({
	categoryName,
	onSuccess,
	onError,
}: Props) {
	const colors = useThemeColors();
	
	// Vérifier si le nom de la catégorie est valide (non vide après nettoyage)
	const isValidCategoryName = categoryName.trim().length > 0;

	// Mutation pour créer une nouvelle catégorie
	const { mutate: createCategory, isPending } = useMutation<
		{ id: number; name: string },
		Error,
		string
	>({
		mutationFn: async (name: string) => {
			const response = await httpPost(`${ENDPOINTS.category.create}`, {
				name,
			});

			console.log('response', response);

			if (!response?.ok) {
				const errorMessage = await response?.text();
				throw new Error(
					errorMessage || 'Échec de la création de la catégorie'
				);
			}

			const data = await response.json();
			return data;
		},
		onSuccess: (data) => {
			// Appeler la fonction de rappel avec la nouvelle catégorie
			onSuccess(data);
		},
		onError: (error: Error) => {
			console.error('Erreur lors de la création de la catégorie:', error);
			if (onError) {
				onError(error);
			}
		},
	});

	const handlePress = () => {
		// Nettoyer le nom de la catégorie en supprimant les espaces en début et fin
		const cleanCategoryName = categoryName.trim();
		if (cleanCategoryName !== '') {
			createCategory(cleanCategoryName);
		} else {
			// Afficher un message d'erreur si le nom est vide
			if (onError) {
				onError(new Error('Le nom de la catégorie ne peut pas être vide'));
			}
		}
	};

	return (
		<TouchableOpacity
			style={[
				styles.button,
				{ 
					backgroundColor: isValidCategoryName ? colors.secondary : colors.primaryLight,
					opacity: isValidCategoryName ? 1 : 0.6,
				},
				isPending && styles.disabled,
			]}
			onPress={handlePress}
			disabled={isPending || !isValidCategoryName}
		>
			<View style={styles.buttonContent}>
				<Ionicons name='add-circle-outline' size={18} color='#FFFFFF' />
				<ThemedText style={styles.buttonText}>
					{isPending
						? 'Création...'
						: isValidCategoryName
						? `Créer "${categoryName.trim()}"`
						: 'Nom de catégorie invalide'}
				</ThemedText>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	button: {
		paddingVertical: 10,
		paddingHorizontal: 15,
		borderRadius: 12,
		marginTop: 8,
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
	},
	buttonContent: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonText: {
		color: '#FFFFFF',
		fontWeight: 'bold',
		marginLeft: 5,
	},
	disabled: {
		opacity: 0.7,
	},
});
