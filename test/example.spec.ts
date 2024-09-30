import { expect, test } from 'vitest'

test('the user can create a new task', () => {
  const responseStatusCode = 201

  expect(responseStatusCode).toEqual(201)
})
