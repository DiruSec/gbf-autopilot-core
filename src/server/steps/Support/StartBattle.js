import noop from "lodash/noop";
import * as Click from "../Click";
import * as Location from "../Location";
import Step from "../Step";

export default function(logger, run) {
  return Step("Support.StartBattle", (_, $, done, fail) => {
    logger.debug("Starting battle...");

    var hasChanged = false;
    run(Click.Condition, ".btn-usual-ok", () => hasChanged).then(noop, fail);
    run(Location.Wait).then(() => run(Location.Get)).then((location) => {
      if (location.hash.startsWith("#raid")) {
        return hasChanged = true;
      } else {
        throw "Unexpected page redirection: '" + location.hash + "'";
      }
    }, fail);

  });
}

exports["@require"] = ["logger", "run"];
