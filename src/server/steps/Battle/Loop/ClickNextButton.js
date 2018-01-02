import noop from "lodash/noop";
import * as Location from "../../Location";
import * as Click from "../../Click";
import Step from "../../Step";

export default function() {
  return Step(function clickNextButton(context) {
    const manager = context.manager;
    return new Promise((resolve, reject) => {
      var hasChanged = false;

      manager.process([
        Location.Wait(/(#raid|#result)/),
        function stopClicking() {
          return hasChanged = true;
        },
        Location.Get(),
        function checkNextLocation(_, location) {
          if (location.hash.startsWith("#raid")) {
            return true; // still in battle
          } else {
            return false;
          }
        }
      ]).then(resolve, reject);

      manager.process([
        Click.Condition(".btn-result", () => hasChanged)
      ]).then(noop, reject);
    });
  });
}
