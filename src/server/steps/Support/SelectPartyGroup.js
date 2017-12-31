import {createProcess} from "../Helper";
import Check from "../Check";
import Click from "../Click";

const partyGroupPrefix = ".btn-select-group.id-";

export default function(group) {
  const partyGroupSelector = partyGroupPrefix + group;
  return createProcess("Support.SelectPartyGroup", function(context, lastResult, done, fail) {
    this.logger.debug("Using party group:", group);
    const promise = Check(partyGroupSelector + ".selected").call(this, context);
    promise.then(done, () => {
      Click(partyGroupSelector).call(this, context).then(done, fail);
    });
  });
}
