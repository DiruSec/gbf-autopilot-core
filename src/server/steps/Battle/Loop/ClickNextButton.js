import noop from "lodash/noop";
import * as Location from "../../Location";
import * as Click from "../../Click";
import Step from "../../Step";

export default function() {
  return Step(function clickNextButton(context) {
    return new Promise((resolve, reject) => {
      var hasChanged = false;
      Location.Wait()
        .call(this, context)
        .then(() => {
          hasChanged = true;
          resolve();
        }, reject);
      Click.Condition(".btn-result", () => hasChanged)
        .call(this, context)
        .then(noop, reject);
    });
  });
}
