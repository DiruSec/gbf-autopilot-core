import noop from "lodash/noop";
import Step from "../Step";

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
  faves: "f",
  favorite: "f"
};

exports = module.exports = (require) => (element) => {
  const Check = require("steps/Check");
  const Click = require("steps/Click");
  const elementSelector = elementPrefix + elementMap[element.toLowerCase()];
  return Step("Support", function SelectElement() {
    return Check(elementSelector + ".unselected").then(() => {
      return Click(elementSelector);
    }, noop);
  });
};

exports["@require"] = ["require"];
