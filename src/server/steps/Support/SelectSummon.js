import isString from "lodash/isString";
import Timeout from "../Timeout";
import Step from "../Step";

exports = module.exports = function(server, worker, logger, config, run, summons) {
  if (isString(summons)) {
    summons = summons.split(",").map((summon) => summon.trim());
  }
  
  return Step("Support.SelectSummon", async function() {
    logger.debug("Preferred summons:", summons);
    const payload = await worker.sendAction("support", summons);
    logger.debug("Selected summon:", payload.summon);
    await run(Timeout, config.scrollDelay);
    return await server.makeRequest("click", payload);
  });
};

exports["@require"] = ["server", "worker", "logger", "coreConfig", "run"];
