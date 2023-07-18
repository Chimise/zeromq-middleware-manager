import { inflateRaw, deflateRaw } from "node:zlib";
import { promisify } from "node:util";

const inflateRawAsync = promisify(inflateRaw);
const deflateRawAsync = promisify(deflateRaw);

export default function compressMiddleware() {
  return {
    inbound(message) {
      return inflateRawAsync(Buffer.from(message));
    },
    outbound(message) {
      return deflateRawAsync(message);
    },
  };
}
