import zeromq from "zeromq";
import compressMiddleware from "./middlewares/compressMiddleware.js";
import jsonMiddleware from "./middlewares/jsonMiddleware.js";
import ZmqMiddlewareManager from "./middleware-manager.js";

async function main () {
  const socket = new zeromq.Request()
  await socket.connect('tcp://127.0.0.1:5000')

  const zmqm = new ZmqMiddlewareManager(socket)
  zmqm.use(compressMiddleware())
  zmqm.use(jsonMiddleware())
  zmqm.use({
    inbound (message) {
      console.log('Echoed back', message)
      return message
    }
  })

  setInterval(() => {
    zmqm.send({ action: 'ping', echo: Date.now() })
      .catch(err => console.error(err))
  }, 1000)

  console.log('Client connected')
}

main()
