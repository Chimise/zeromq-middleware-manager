import zeromq from "zeromq";
import compressMiddleware from "./middlewares/compressMiddleware.js";
import jsonMiddleware from "./middlewares/jsonMiddleware.js";
import ZmqMiddlewareManager from "./middleware-manager.js";

async function main() {
  const port = process.env.PORT || 5000;
  const socket = new zeromq.Reply();
  await socket.bind(`tcp://127.0.0.1:${port}`);
  const zmqm = new ZmqMiddlewareManager(socket);
  zmqm.use(compressMiddleware());
  zmqm.use(jsonMiddleware());

  zmqm.use({
    async inbound(message) {
      console.log("Received", message);
      if (message.action === "ping") {
        await this.send({ action: "pong", echo: message.echo });
      }
      return message;
    },
  });

  console.log("TCP server started on port %d", port);
}

main().catch((err) => console.log(err));
