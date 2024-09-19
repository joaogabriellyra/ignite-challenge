import { Knex } from 'knex'
import { knex } from '../database'

export default class TaskService {
  private model: Knex

  constructor() {
    this.model = knex
  }

  public async create(task: unknown): Promise<void> {
    await knex('tasks').insert(task)
  }
}
