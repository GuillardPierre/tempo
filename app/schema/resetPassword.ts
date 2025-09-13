// resetPasswordSchema.ts
import { z } from 'zod';

export const resetPasswordSchema = z
	.object({
		password: z
			.string()
			.nonempty('Le mot de passe est requis')
			.min(4, 'Le mot de passe doit contenir au moins 4 caractères'),
		confirmPassword: z
			.string()
			.nonempty('La confirmation du mot de passe est requise'),
		code: z
			.string()
			.nonempty('Le code de réinitialisation est requis')
			.min(6, 'Le code doit contenir au moins 6 caractères'),
		email: z
			.string()
			.nonempty("L'adresse email est requise")
			.email("Format d'email invalide"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Les mots de passe ne correspondent pas',
		path: ['confirmPassword'],
	});

export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
