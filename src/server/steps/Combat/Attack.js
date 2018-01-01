import {createProcess} from "../Helper";
import * as Click from "../Click";
import Check from "../Check";

export default function Attack() {
  return createProcess("Combat.Attack", function(context) {
    this.logger.debug("Attacking...");
    const condition = () => new Promise((resolve, reject) => {
      Check(".btn-attack-start.display-on")
        .call(this, context)
        .then(reject, resolve);
    });
    return Click.Condition(".btn-attack-start", condition)
      .call(this, context);
  });
}
