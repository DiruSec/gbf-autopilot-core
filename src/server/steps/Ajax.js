import {createProcess} from "./Helper";

export default function Ajax(options) {
  return createProcess("Ajax", function() {
    this.logger.debug("Ajax:", options.method || "GET", options.url);
    return this.sendAction("ajax", options);
  });
}
