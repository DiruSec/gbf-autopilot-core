import {createProcess} from "../Helper";
import * as Click from "../Click";

const partyGroupPrefix = ".btn-select-group.id-";

export default function(group) {
  const partyGroupSelector = partyGroupPrefix + group;
  return createProcess("Support.SelectPartyGroup", function(context) {
    this.logger.debug("Using party group:", group);
    return Click.Condition(partyGroupSelector, "!" + partyGroupSelector + ".selected")
      .call(this, context);
  });
}
