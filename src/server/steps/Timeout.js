import {createProcess} from "./Helper";

export default function(timeout) {
  return createProcess("Timeout", ({server}, lastResult, done) => {
    server.logger.debug("Timeout:", timeout);
    setTimeout(() => done(lastResult), timeout);
  });
}
