import Check from "../Check";
import Click from "../Click";

const partyGroupPrefix = ".btn-select-group.id-";

export default function(group) {
  const partyGroupSelector = partyGroupPrefix + group;
  return function SelectPartyGroup(context) {
    return new Promise((resolve, reject) => {
      const promise = Check(partyGroupSelector + ".selected")(context);
      promise.then(resolve, () => {
        Click(partyGroupSelector)(context).then(resolve, reject);
      });
    });
  };
}
