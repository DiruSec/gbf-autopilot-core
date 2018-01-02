import {createProcess} from "../Helper";
import * as Click from "../Click";

export default function Attack() {
  return createProcess("Combat.Attack", function(context) {
    this.logger.debug("Attacking...");
    return Click.Condition(".btn-attack-start", ".btn-attack-start.display-on")
      .call(this, context);
  });
}
