import isObject from "lodash/isObject";

exports = module.exports = (server, logger, worker) => (selector) => {
  return function Click() {
    if (isObject(selector)) { 
      // asume the selector argument contains the element data
      return server.makeRequest("click", selector);
    }
    logger.debug("Clicking element:", selector);
    return worker.sendAction("element", {selector, retry: true}).then((payload) => {
      return server.makeRequest("click", payload);
    });
  };
};

exports["@require"] = ["server", "logger", "worker"];
exports.Condition = require("./Condition");
