import {createProcess} from "../Helper";
import Check from "../Check";
import Click from "../Click";

const partyGroupPrefix = ".btn-select-group.id-";

export default function(group) {
  const partyGroupSelector = partyGroupPrefix + group;
  return createProcess("Support.SelectPartyGroup", (context, lastResult, done, fail) => {
    const promise = Check(partyGroupSelector + ".selected")(context);
    promise.then(done, () => {
      Click(partyGroupSelector)(context).then(done, fail);
    });
  });
}
