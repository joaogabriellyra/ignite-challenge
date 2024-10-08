import { knex as setupKnex, Knex } from 'knex'
import 'dotenv/config'
import { env } from './env'

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection:
    env.DATABASE_CLIENT === 'sqlite' ? { filename: env.DB_URL } : env.DB_URL,
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: 'db/migrations',
  },
}

export const knex = setupKnex(config)
