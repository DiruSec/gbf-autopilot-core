import Step from "./Step";

exports = module.exports = (logger, worker) => (options) => {
  return Step(function Ajax() {
    logger.debug("Ajax:", options.method || "GET", options.url || options);
    return worker.sendAction("ajax", options);
  });
};

exports["@require"] = ["logger", "worker"];
