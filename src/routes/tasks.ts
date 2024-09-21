import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import TaskController from '../controllers/tasks'

export async function tasksRoutes(app: FastifyInstance) {
  app.post('/', async (req: FastifyRequest, reply: FastifyReply) =>
    new TaskController(req, reply).createTask(),
  )

  app.get('/', async (req: FastifyRequest, reply: FastifyReply) =>
    new TaskController(req, reply).getTasks(),
  )

  app.put('/:id', async (req: FastifyRequest, reply: FastifyReply) =>
    new TaskController(req, reply).updateTask(),
  )

  app.delete('/:id', async (req: FastifyRequest, reply: FastifyReply) =>
    new TaskController(req, reply).deleteTask(),
  )
}
