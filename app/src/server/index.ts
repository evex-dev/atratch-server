import {Hono} from "hono"

export default function createServer() {
  const server = new Hono()

  server.get('/', (c) => {
    return c.text('server test')
  })

  return server
}