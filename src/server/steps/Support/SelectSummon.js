import isString from "lodash/isString";
import Step from "../Step";

// const elementMap = {
//   1: "fire",
//   2: "water",
//   3: "earth",
//   4: "wind",
//   5: "light",
//   6: "dark",
//   7: "misc",
//   f: "favorite"
// };

exports = module.exports = (env, context, coreConfig, require, run, process) => (summons, summonRefresh) => {
  if (isString(summons)) {
    summons = summons.split(",").map((summon) => summon.trim());
  }
  
  const {server, worker, logger} = context;

  const Timeout = require("steps/Timeout");
  const Element = require("steps/Element");
  const Location = require("steps/Location");
  const SummonRefresh = require("pipelines/SummonRefresh");

  const checkSummonRefresh = async (payload) => {
    if (payload.preferred) return payload;
    const selector = "#prt-type > .btn-type:not(.unselected)";
    const questPage = await run(Location());
    const attrs = await run(Element.Attributes(selector, "class"));
    const className = attrs["class"];
    const firstClass = className.split(" ")[0];
    const element = firstClass.substring(firstClass.length - 1);
    return process(SummonRefresh(summons, element, questPage));
  };

  return Step("Support", function SelectSummon() {
    logger.debug("Preferred summons:", summons);
    return worker.sendAction("support", summons).then((payload) => {
      const next = (payload) => {
        logger.info("Selected summon:", payload.summon);
        return run(Timeout(coreConfig.scrollDelay), payload);
      };

      if (summonRefresh) {
        logger.info("Preferred summons not found. Refreshing summons.");
        return checkSummonRefresh(payload).then(next);
      } else {
        return next(payload);
      }
    }).then((payload) => {
      return server.makeRequest("click", payload);
    });
  });
};

exports["@require"] = ["env", "context", "coreConfig", "require", "run", "process"];
