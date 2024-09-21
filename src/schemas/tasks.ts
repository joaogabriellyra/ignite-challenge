import { z } from 'zod'

export const createTaskBodySchema = z.object({
  title: z.string(),
  description: z.string(),
})

export const idSchema = z.object({
  id: z.string().uuid(),
})

export const updateTaskBodySchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
  })
  .refine(
    (data) => {
      return data.title || data.description
    },
    {
      message: 'At least one field must be provided',
    },
  )
