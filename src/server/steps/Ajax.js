import Step from "./Step";

exports = module.exports = function(logger, worker, options) {
  return Step(function Ajax() {
    logger.debug("Ajax:", options.method || "GET", options.url || options);
    return worker.sendAction("ajax", options);
  });
};

exports["@require"] = ["logger", "worker"];
