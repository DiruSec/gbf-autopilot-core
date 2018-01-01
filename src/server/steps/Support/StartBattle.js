import noop from "lodash/noop";
import {createProcess} from "../Helper";
import * as Click from "../Click";
import * as Location from "../Location";

export default function() {
  return createProcess("Support.StartBattle", function(context, $, done, fail) {
    this.logger.debug("Starting battle...");
    var hasChanged = false;
    const manager = context.manager;

    manager.process([
      Location.Wait(),
      Location.Get(),
      function checkLocation(_, location) {
        if (location.hash.startsWith("#raid")) {
          hasChanged = true;
        } else {
          throw "Unexpected page redirection: '" + location.hash + "'";
        }
      }
    ]).then(noop, fail);

    Click.Condition(".btn-usual-ok", () => hasChanged)
      .call(this, context)
      .then(done, fail);
  });
}
