import { z } from 'zod';

export const recurrenceExceptionSchema = () => {
	return z.object({
		pauseStart: z.date(),
		pauseEnd: z.date(),
	});
};
