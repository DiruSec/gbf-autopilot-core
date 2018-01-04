import Step from "../Step";

exports = module.exports = function(logger, timeout) {
  return Step(function Timeout(_, lastResult, done) {
    logger.debug("Timeout:", timeout);
    setTimeout(() => done(lastResult), timeout);
  });
};

exports["@require"] = ["logger"];
