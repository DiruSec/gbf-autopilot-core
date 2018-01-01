import {createProcess} from "../Helper";
import * as Click from "../Click";
import Check from "../Check";

const partyGroupPrefix = ".btn-select-group.id-";

export default function(group) {
  const partyGroupSelector = partyGroupPrefix + group;
  return createProcess("Support.SelectPartyGroup", function(context) {
    this.logger.debug("Using party group:", group);
    return Click.Condition(partyGroupSelector, () => {
      return Check(partyGroupSelector + ".selected").call(this, context);
    }).call(this, context);
  });
}
