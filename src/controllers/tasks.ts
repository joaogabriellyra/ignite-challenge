import { FastifyReply, FastifyRequest } from 'fastify'
import TaskService from '../services/tasks'

export default class TaskController {
  constructor(private taskService: TaskService) {}

  async createTask(req: FastifyRequest, reply: FastifyReply) {}
}
