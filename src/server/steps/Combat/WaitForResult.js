import Step from "../Step";

exports = module.exports = (logger, require, run) => () => {
  const WaitForAjax = require("steps/WaitForAjax");
  return Step("Combat", async function WaitForResult() {
    logger.debug("Waiting for action result");
    await run(WaitForAjax(/\/rest\/(multi)?raid\/.+_result\.json/));
    logger.debug("Action result received");
  });
};

exports["@require"] = ["logger", "require", "run"];
