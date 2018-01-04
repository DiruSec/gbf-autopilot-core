import Step from "./Step";

exports = module.exports = function(server, worker, logger, selector, timeout) {
  return Step(function Check() {
    logger.debug("Checking element:", selector);
    return worker.sendAction("element", {selector, scroll: false, retry: false}, timeout);
  });
};

exports["@require"] = ["server", "worker", "logger"];
