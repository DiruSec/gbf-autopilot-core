import Check from "../Check";
import Click from "../Click";
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

exports = module.exports = function(run, element) {
  const elementSelector = elementPrefix + elementMap[element.toLowerCase()];
  return Step("Support.SelectElement", async () => {
    try {
      await run(Check, elementSelector + ".unselected");
    } catch (err) {
      return err;
    }
    return await run(Click, elementSelector);
  });
};

exports["@require"] = ["run"];
