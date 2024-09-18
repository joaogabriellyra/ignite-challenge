import fastify from 'fastify'
import { env } from './env'

const app = fastify()

app
  .listen({
    port: Number(env.PORT),
  })
  .then(() => {
    console.log('HTTP Server Running')
  })
