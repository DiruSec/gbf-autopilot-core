import noop from "lodash/noop";
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

exports = module.exports = (
  env,
  context,
  coreConfig,
  require,
  run,
  process
) => (summons, summonReroll) => {
  if (isString(summons)) {
    summons = summons.split(",").map(summon => summon.trim());
  }

  const { server, worker, logger } = context;

  const Wait = require("steps/Wait");
  const Timeout = require("steps/Timeout");
  const Element = require("steps/Element");
  const Location = require("steps/Location");
  const SummonReroll = require("steps/Support/SummonReroll");

  const checkSummonReroll = async payload => {
    if (payload.preferred) return payload;
    logger.info("Preferred summons not found. Refreshing summons.");
    const selector = "#prt-type > .btn-type:not(.unselected)";
    const location = await run(Location());
    const attrs = await run(Element.Attributes(selector, "class"));
    const className = attrs["class"];
    const firstClass = className.split(" ")[0];
    const element = firstClass.substring(firstClass.length - 1);
    return process(SummonReroll(summons, element, location));
  };

  return Step("Support", function SelectSummon() {
    logger.debug("Preferred summons:", summons);
    return worker
      .sendAction("support", summons)
      .then(payload => {
        const next = payload => {
          logger.info("Selected summon:", payload.summon);
          return run(Timeout(coreConfig.scrollDelay), payload);
        };

        if (summonReroll) {
          return checkSummonReroll(payload)
            .then(() => {
              return worker.sendAction("support", summons);
            })
            .then(next);
        } else {
          return next(payload);
        }
      })
      .then(
        payload =>
          new Promise((resolve, reject) => {
            let popupShown = false;
            const selector = ".pop-deck.supporter,.pop-deck.supporter_raid";
            run(Wait(selector)).then(() => {
              resolve((popupShown = true));
            }, reject);

            const doClick = (done, fail) => {
              if (popupShown) return done(true);
              return server.makeRequest("click", payload).then(() => {
                return run(Timeout(coreConfig.popupDelay)).then(() =>
                  doClick(done, fail)
                );
              }, fail);
            };
            doClick(resolve, reject);
          })
      );
  });
};

exports["@require"] = [
  "env",
  "context",
  "coreConfig",
  "require",
  "run",
  "process"
];
