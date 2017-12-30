import {createProcess} from "../Helper";
import Check from "../Check";
import Click from "../Click";

const elementPrefix = ".icon-supporter-type-";
const elementMap = {
  fire: 1,
  water: 2,
  earth: 3,
  wind: 4,
  light: 5,
  dark: 6,
  misc: 7,
  // Viramate's favorite tab
  faves: "f"
};

export default function(element) {
  const elementSelector = elementPrefix + elementMap[element.toLowerCase()];
  return createProcess("Support.SelectElement", function(_, $, done, fail) {
    Check(elementSelector + ".selected").call(this, _).then(done, () => {
      return Click(elementSelector).call(this, _);
    }).then(done, fail);
  });
}
