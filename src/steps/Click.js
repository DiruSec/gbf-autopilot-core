import {createProcess} from "./Helper";

export default function(selector, timeout) {
  return createProcess("Click", ({server, worker}, done, fail) => {
    server.logger.debug("Clicking element:", selector);
    const promise = worker.sendAction("element", {selector, retry: true}, timeout);
    promise.then((payload) => {
      return server.makeRequest("click", payload);
    }).then(done, fail);
  });
}
