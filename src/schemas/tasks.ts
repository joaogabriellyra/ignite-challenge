import { z } from 'zod'

export const createTaskBodySchema = z.object({
  title: z.string(),
  description: z.string(),
})
