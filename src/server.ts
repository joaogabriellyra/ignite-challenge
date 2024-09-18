import fastify from 'fastify'
import { env } from './env'
import { tasksRoutes } from './routes/tasks'

const app = fastify()

app.register(tasksRoutes)

app
  .listen({
    port: Number(env.PORT),
  })
  .then(() => {
    console.log('HTTP Server Running')
  })
