import { z } from 'zod'

export const createTaskBodySchema = z.object({
  title: z.string(),
  description: z.string(),
  completed_at: z.date(),
  created_at: z.date(),
  updated_at: z.date(),
})
