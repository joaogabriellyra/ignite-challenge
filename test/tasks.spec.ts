import { afterAll, beforeAll, describe, expect, it, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'child_process'

const taskMocha = {
  title: 'new task',
  description: 'solve the new task',
}

describe('Tasks route', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it.skip('should be able to create a new task', async () => {
    const expectedResponseStatusCode = 201
    const response = await request(app.server).post('/tasks').send(taskMocha)
    expect(response.statusCode).toEqual(expectedResponseStatusCode)
  })

  it('should be able to list all tasks and find the last task created', async () => {
    const expectedResponse = taskMocha

    await request(app.server).post('/tasks').send(taskMocha).expect(201)
    const response = await request(app.server).get('/tasks').expect(200)
    expect(response.body).toEqual([expect.objectContaining(expectedResponse)])
  })
})
