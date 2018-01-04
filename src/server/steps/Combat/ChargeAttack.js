import * as Key from "../Key";
import * as Battle from "../Battle";
import Step from "../Step";

exports = module.exports = function(logger, run, enable) {
  const doToggle = async () => run(Key.Press, "c");
  return Step("Combat", async function ChargeAttack() {
    logger.debug("Charge attack:", enable);
    const state = await run(Battle.State);
    if ((enable && state.lock === 1) || (!enable && state.lock === 0)) {
      await doToggle();
    }
  });
};

exports["@require"] = ["logger", "run"];
