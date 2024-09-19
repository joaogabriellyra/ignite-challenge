import { FastifyReply, FastifyRequest } from 'fastify'
import TaskService from '../services/tasks'
import { createTaskBodySchema } from '../schemas/tasks'
import { randomUUID } from 'crypto'

export default class TaskController {
  private req: FastifyRequest
  private reply: FastifyReply
  private service: TaskService
  constructor(req: FastifyRequest, reply: FastifyReply) {
    this.req = req
    this.reply = reply
    this.service = new TaskService()
  }

  public async createTask() {
    try {
      const newTask = createTaskBodySchema.parse(this.req.body)
      await this.service.create({
        id: randomUUID(),
        ...newTask,
      })
      this.reply.status(201).send()
    } catch (error) {
      this.reply.status(500).send({ error })
    }
  }
}
