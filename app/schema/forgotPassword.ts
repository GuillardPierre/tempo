// forgotPasswordSchema.ts
import { z } from 'zod';

export const forgotPasswordSchema = z.object({
	email: z
		.string()
		.nonempty("L'adresse email est requise")
		.email("Format d'email invalide"),
});

export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
