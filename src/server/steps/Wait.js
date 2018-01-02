import {createProcess} from "./Helper";

export default function(selector) {
  return createProcess("Wait", function() {
    this.logger.debug("Waiting element:", selector);
    return this.sendAction("element", {selector, scroll: false, retry: true});
  }, {
    doNotTimeout: true
  });
}
