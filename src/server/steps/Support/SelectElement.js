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

exports = module.exports = (require, run) => (element) => {
  if (typeof element === "string" && element.length > 1) {
    element = element.toLowerCase();
    element = elementMap[element] || element.substring(0, 1);
  }
  const Check = require("steps/Check");
  const Click = require("steps/Click");
  const elementSelector = elementPrefix + element;
  return Step("Support", function SelectElement() {
    return run(Check(elementSelector + ".unselected")).then(() => {
      return run(Click(elementSelector));
    }, noop);
  });
};

exports["@require"] = ["require", "run"];
