import noop from "lodash/noop";
import isString from "lodash/isString";
import Step from "../Step";

exports = module.exports = (
  env,
  context,
  config,
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

  const supporterSelectors = require("selectors/SupporterPage");

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

  const verificationEnabled = config.get("Verification.SummonVerifyEnabled");
  const verificationCount = Number(
    config.get("Verification.SummonVerifyTriggeredWhenSelectionIsLessThan")
  );

  return Step("Support", function SelectSummon() {
    logger.debug("Preferred summons:", summons);
    return worker
      .sendAction("element.count", supporterSelectors.SUMMON_SELECTION)
      .then(count => {
        if (verificationEnabled) {
          if (count < verificationCount) {
            logger.error(
              "WARNING:",
              `Summon selection count is less than the defined ${verificationCount}.`,
              "Stopping the bot due to possibility of the verification button."
            );
            throw new Error(
              `Selection count is less than the defined ${verificationCount}. Stopping.`
            );
          }
        }

        return worker.sendAction("support", summons);
      })
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
      .then(payload => {
        return new Promise((resolve, reject) => {
          var popupShown = false;
          const selector = ".pop-deck.supporter,.pop-deck.supporter_raid";
          run(Wait(selector)).then(() => {
            resolve((popupShown = true));
          }, reject);

          const doClick = (done, fail) => {
            if (popupShown) return done(true);
            return server.makeRequest("click", payload).then(() => {
              return run(Timeout(coreConfig.popupDelay + 3500)).then(() =>
                doClick(done, fail)
              );
            }, fail);
          };
          doClick(noop, reject);
        });
      });
  });
};

exports["@require"] = [
  "env",
  "context",
  "config",
  "coreConfig",
  "require",
  "run",
  "process"
];
