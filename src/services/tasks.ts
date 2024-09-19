import { Knex } from 'knex'
import { knex } from '../database'
import ITask from '../interfaces/itask'

export default class TaskService {
  private model: Knex

  constructor() {
    this.model = knex
  }

  public async create(task: ITask): Promise<void> {
    await knex('tasks').insert(task)
  }

  public async getTasks(): Promise<ITask[]> {
    return await knex('tasks').select(
      'title',
      'description',
      'completed_at',
      'created_at',
      'updated_at',
    )
  }
}
