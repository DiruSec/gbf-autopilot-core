import UseItem from "./UseItem";
import Step from "../Step";

export default function RefillAP(env, run, logger, num) {
  num = num || 1;
  env.potUsed = env.potUsed || 0;
  return Step("Quest.RefillAP", async function() {
    logger.debug("Refilling AP...");
    await run(UseItem, 2, num);
    env.potUsed++;
    logger.debug("Pot used:", env.potUsed);
    return true;
  });
}

exports["@require"] = ["env", "run", "logger"];
