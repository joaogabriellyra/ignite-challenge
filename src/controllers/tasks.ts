import { FastifyReply, FastifyRequest } from 'fastify'
import TaskService from '../services/tasks'
import {
  createTaskBodySchema,
  idSchema,
  updateTaskBodySchema,
} from '../schemas/tasks'
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

  public async getTasks() {
    try {
      const tasks = await this.service.getTasks()
      this.reply.status(200).send(tasks)
    } catch (error) {
      this.reply.status(500).send({ error })
    }
  }

  public async updateTask() {
    try {
      const id = idSchema.parse(this.req.params)
      const taskWithChanges = updateTaskBodySchema.parse(this.req.body)
      const updatedTask = await this.service.updateTaskById(id, taskWithChanges)
      if (!updateTaskBodySchema)
        return this.reply.status(404).send({ message: 'Task not found' })
      this.reply.status(201).send(taskWithChanges)
    } catch (error) {
      this.reply.status(500).send({ error })
    }
  }
}
