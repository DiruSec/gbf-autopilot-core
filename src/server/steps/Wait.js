import Step from "./Step";

exports = module.exports = (logger, worker) => (selector) => {
  return Step(function Wait() {
    logger.debug("Waiting element:", selector);
    return worker.sendAction("element", {selector, scroll: false, retry: true});
  }, {
    doNotTimeout: true
  });
};

exports["@require"] = ["logger", "worker"];
