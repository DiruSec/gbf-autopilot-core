import * as Click from "../Click";
import Step from "../Step";

export default function(logger, run) {
  return Step("Combat", async function Attack() {
    logger.debug("Attacking...");
    return await run(Click.Condition, ".btn-attack-start", ".btn-attack-start.display-on")
  });
}

exports["@require"] = ["logger", "run"];
