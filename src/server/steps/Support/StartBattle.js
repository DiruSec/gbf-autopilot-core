import noop from "lodash/noop";
import Step from "../Step";

exports = module.exports = (logger, require) => () => {
  const Click = require("steps/Click");
  const Location = require("steps/Location");

  return Step("Support.StartBattle", (_, $, done, fail) => {
    logger.debug("Starting battle...");

    var hasChanged = false;
    Click.Condition(".btn-usual-ok", () => hasChanged).then(noop, fail);
    Location.Wait().then(Location.Get).then((location) => {
      if (location.hash.startsWith("#raid")) {
        return hasChanged = true;
      } else {
        throw "Unexpected page redirection: '" + location.hash + "'";
      }
    }, fail);

  });
};

exports["@require"] = ["logger", "require"];
