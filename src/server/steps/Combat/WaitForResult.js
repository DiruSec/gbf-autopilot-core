import WaitForAjax from "../WaitForAjax";
import Step from "../Step";

exports = module.exports = function(manager, logger, run) {
  return Step("Combat", async function WaitForResult() {
    logger.debug("Waiting for action result");
    await run(WaitForAjax, /\/rest\/(multi)?raid\/.+_result\.json/);
    logger.debug("Action result received");
  });
};

exports["@require"] = ["manager", "logger", "run"];
