import { FastifyReply, FastifyRequest } from 'fastify'
import TaskService from '../services/tasks'
import {
  createTaskBodySchema,
  idSchema,
  updateTaskBodySchema,
} from '../schemas/tasks'
import { randomUUID } from 'crypto'
import { csvReader } from '../utils/csvreader'

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
      const { id } = idSchema.parse(this.req.params)
      const { title, description } = updateTaskBodySchema.parse(this.req.body)

      const updatedTask = await this.service.updateTaskById(
        id,
        title,
        description,
      )
      if (!updatedTask) {
        return this.reply.status(404).send({ message: 'Task not found' })
      }
      this.reply.status(201).send(updatedTask)
    } catch (error) {
      this.reply.status(500).send({ error })
    }
  }

  public async deleteTask() {
    try {
      const { id } = idSchema.parse(this.req.params)
      const deletedTask = await this.service.deleteTaskById(id)
      if (!deletedTask) {
        return this.reply.status(404).send({ message: 'Task not found' })
      }
      return this.reply.status(204).send()
    } catch (error) {
      this.reply.status(500).send({ error })
    }
  }

  public async completeTask() {
    try {
      const { id } = idSchema.parse(this.req.params)
      const [{ completed_at: completedAt }] =
        await this.service.completeATaskById(id)
      if (!completedAt) {
        return this.reply.status(404).send({ message: 'Task not found' })
      }
      return this.reply.status(204).send()
    } catch (error) {
      this.reply.status(500).send({ error })
    }
  }

  public async insertTaskUsingCSVFile() {
    try {
      const tasks = await csvReader()
      if (tasks.length) {
        tasks.forEach(async (task) => {
          const newTask = createTaskBodySchema.parse(task)
          await this.service.create({
            id: randomUUID(),
            ...newTask,
          })
        })
        return this.reply.status(201).send()
      }
      return this.reply.status(404).send({ message: 'EMPTY CSV FILE' })
    } catch (error) {
      this.reply.status(500).send({ error })
    }
  }
}
