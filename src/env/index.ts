import { config } from 'dotenv'
import { join } from 'path'
import { z } from 'zod'

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
config({ path: join(__dirname, envFile) })

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  DB_URL: z.string(),
  PORT: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Environment variable error', _env.error?.format())

  throw new Error('Environment variable error')
}

export const env = _env.data
