import { z } from 'zod';

export const loginSchema = z.object({
	email: z
		.string()
		.nonempty("L'adresse email est requise")
		.email("Format d'adresse email invalide"),
	password: z.string().nonempty('Le mot de passe est requis'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
