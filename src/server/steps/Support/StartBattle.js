import noop from "lodash/noop";
import Step from "../Step";

exports = module.exports = (logger, require, run) => () => {
  const Wait = require("steps/Wait");
  const Check = require("steps/Check");
  const Click = require("steps/Click");
  const Location = require("steps/Location");

  const clickPopup = (done, fail) => {
    return run(Check(".pop-skip-result")).then(() => {
      return run(Click.Condition(".btn-usual-ok")).then(() => {
        return run(Wait(".btn-attack-start"));
      }).then(done, fail);
    }, done);
  };

  const checkPopup = (done, fail) => {
    return run(Wait(".btn-attack-start,.pop-skip-result")).then(() => {
      return clickPopup(noop, fail);
    }).then(() => done(true), fail);
  };

  return Step("Support", function StartBattle(_, $, done, fail) {
    logger.debug("Starting battle...");

    var hasChanged = false;
    run(Click.Condition(".btn-usual-ok", () => hasChanged)).then(noop, fail);
    run(Location.Wait()).then(() => {
      return run(Location());
    }).then((location) => {
      hasChanged = true;
      if (location) {
        if (location.hash.startsWith("#raid")) {
          return done(true);
        } else if (location.hash.startsWith("#quest/stage")) {
          return checkPopup(done, fail);
        } else {
          return fail(new Error("Unexpected page redirection: '" + location.hash + "'"));
        }
      } else {
        return fail(new Error("Can't fetch the location"));
      }
    }, fail);

  });
};

exports["@require"] = ["logger", "require", "run"];
