import Step from "./Step";

exports = module.exports = function(logger, selector) {
  return Step(function Wait() {
    this.logger.debug("Waiting element:", selector);
    return this.sendAction("element", {selector, scroll: false, retry: true});
  }, {
    doNotTimeout: true
  });
};

exports["@require"] = ["logger"];
