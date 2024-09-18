import { FastifyInstance } from 'fastify'

export async function tasksRoutes(app: FastifyInstance) {
  app.get('/tasks', async () => {
    return 'Hello'
  })
}
