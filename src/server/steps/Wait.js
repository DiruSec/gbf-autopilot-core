import {createProcess} from "./Helper";

export default function(selector, timeout) {
  return createProcess("Wait", ({server, worker}) => {
    server.logger.debug("Waiting element:", selector);
    return worker.sendAction("element", {selector, scroll: false, retry: true}, timeout);
  });
}
