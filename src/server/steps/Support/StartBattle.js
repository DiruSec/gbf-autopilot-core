import noop from "lodash/noop";
import Step from "../Step";

exports = module.exports = (logger, require, run) => () => {
  const Click = require("steps/Click");
  const Location = require("steps/Location");

  return Step("Support", function StartBattle(_, $, done, fail) {
    logger.debug("Starting battle...");

    var hasChanged = false;
    run(Click.Condition(".btn-usual-ok", () => hasChanged)).then(noop, fail);
    run(Location.Wait()).then(() => {
      return run(Location());
    }).then((location) => {
      if (location && location.hash.startsWith("#raid")) {
        return done(hasChanged = true);
      } else {
        return fail(new Error("Unexpected page redirection: '" + location.hash + "'"));
      }
    }, fail);

  });
};

exports["@require"] = ["logger", "require", "run"];
