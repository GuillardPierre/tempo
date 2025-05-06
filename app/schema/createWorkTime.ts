import { z } from 'zod';

export const createWorkTimeSchema = (endIsDefine: boolean) => {
	return z
		.object({
			category: z.object({
				id: z.string().nullable(),
				title: z.string().min(1, 'Une catégorie est requise'),
			}),
			startTime: z.date(),
			endTime: z.date().nullish(),
			recurrence: z
				.object({
					freq: z.string(),
					byDay: z.array(z.string()).optional(),
				})
				.optional(),
		})
		.refine(
			(data) => {
				if (endIsDefine && data.endTime) {
					return data.endTime > data.startTime;
				}
				return true;
			},
			{
				message: "L'heure de fin doit être après l'heure de début",
				path: ['endTime'],
			}
		);
};
