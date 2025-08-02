import { z } from 'zod';

export const createWorkTimeSchema = () => {
	return z
		.object({
			category: z.object({
				id: z.string().nullable(),
				title: z.string().min(1, 'Une catégorie est requise'),
			}),
			startHour: z.date(),
			endHour: z.date().nullish(),
			recurrence: z
				.object({
					freq: z.string(),
					byDay: z.array(z.string()).optional(),
				})
				.optional(),
		})
		.refine(
			(data) => {
				if (data.endHour) {
					return data.endHour > data.startHour;
				}
				return true;
			},
			{
				message: "L'heure de fin doit être après l'heure de début",
				path: ['endHour'],
			}
		);
};
