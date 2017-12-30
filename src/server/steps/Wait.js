import {createProcess} from "./Helper";

export default function(selector, timeout) {
  return createProcess("Wait", function() {
    timeout = timeout || this.config.Server.ProcessTimeoutInMs;
    this.logger.debug("Waiting element:", selector);
    return this.sendAction("element", {selector, scroll: false, retry: true}, timeout);
  }, {
    doNotTimeout: true
  });
}
