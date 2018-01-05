import Step from "./Step";

exports = module.exports = (logger) => (timeout) => {
  return Step(function Timeout(_, lastResult, done) {
    logger.debug("Timeout:", timeout);
    setTimeout(() => done(lastResult), timeout);
  });
};

exports["@require"] = ["logger"];
