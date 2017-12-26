import {createProcess} from "../Helper";
import Check from "~/steps/Check";
import Click from "~/steps/Click";

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
  const changeElementTab = (context, done, fail) => {
    Click(elementSelector)(context).then(done, fail);
  };

  return createProcess("Support.SelectElement", (context, lastResult, done, fail) => {
    const promise = Check(elementSelector + ".selected")(context);
    promise.then(done, () => {
      changeElementTab(context, done, fail);
    });
  });
}
