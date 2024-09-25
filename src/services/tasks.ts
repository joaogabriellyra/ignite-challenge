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

  public async updateTaskById(
    id: string,
    title: string | undefined,
    description: string | undefined,
  ): Promise<ITask> {
    return await knex('tasks').where({ id }).update({
      title,
      description,
      updated_at: knex.fn.now(),
    })
  }

  public async deleteTaskById(id: string): Promise<ITask> {
    return await knex('tasks').where({ id }).del()
  }

  public async completeATaskById(id: string): Promise<ITask[]> {
    return await knex('tasks')
      .where({ id })
      .update({
        completed_at: knex.fn.now(),
        updated_at: knex.fn.now(),
      })
      .returning([
        'title',
        'description',
        'completed_at',
        'created_at',
        'updated_at',
      ])
  }
}
