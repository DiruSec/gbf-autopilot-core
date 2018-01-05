import isString from "lodash/isString";
import Step from "../Step";

exports = module.exports = (server, worker, logger, config, require) => (summons) => {
  if (isString(summons)) {
    summons = summons.split(",").map((summon) => summon.trim());
  }
  
  const Timeout = require("steps/Timeout");
  return Step("Support.SelectSummon", async function() {
    logger.debug("Preferred summons:", summons);
    const payload = await worker.sendAction("support", summons);
    logger.debug("Selected summon:", payload.summon);
    await Timeout(config.scrollDelay);
    return await server.makeRequest("click", payload);
  });
};

exports["@require"] = ["server", "worker", "logger", "coreConfig", "require"];
