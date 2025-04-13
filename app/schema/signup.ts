// signupFormSchema.ts
import { z } from 'zod';

export const signupFormSchema = z
	.object({
		username: z.string().nonempty("Le nom d'utilisateur est requis"),
		email: z
			.string()
			.nonempty("L'adresse email est requise")
			.email("Format d'email invalide"),
		password: z.string().nonempty('Le mot de passe est requis'),
		confirmPassword: z
			.string()
			.nonempty('La confirmation du mot de passe est requise'),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Les mots de passe ne correspondent pas',
		path: ['confirmPassword'],
	});

export type SignupFormData = z.infer<typeof signupFormSchema>;
