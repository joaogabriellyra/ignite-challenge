import { FastifyInstance } from 'fastify'

export async function tasksRoutes(app: FastifyInstance) {
  app.post('/tasks', async () => {})
}
