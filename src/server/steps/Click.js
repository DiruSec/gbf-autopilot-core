import {createProcess} from "./Helper";

export default function(selector, timeout) {
  return createProcess("Click", function($, _, done, fail) {
    this.logger.debug("Clicking element:", selector);
    this.sendAction("element", {selector, retry: true}, timeout).then((payload) => {
      return this.server.makeRequest("click", payload);
    }).then(done, fail);
  });
}
