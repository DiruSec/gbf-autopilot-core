import isString from "lodash/isString";
import Step from "../Step";

exports = module.exports = (server, worker, logger, config, require, run) => (summons) => {
  if (isString(summons)) {
    summons = summons.split(",").map((summon) => summon.trim());
  }
  
  const Timeout = require("steps/Timeout");
  return Step("Support", function SelectSummon() {
    logger.debug("Preferred summons:", summons);
    return worker.sendAction("support", summons).then((payload) => {
      logger.debug("Selected summon:", payload.summon);
      return run(Timeout(config.scrollDelay), payload);
    }).then((payload) => {
      return server.makeRequest("click", payload);
    });
  });
};

exports["@require"] = ["server", "worker", "logger", "coreConfig", "require", "run"];
