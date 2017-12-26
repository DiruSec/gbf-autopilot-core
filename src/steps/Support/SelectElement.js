import Check from "~/steps/Check";
import Click from "~/steps/Click";
import Timeout from "~/steps/Timeout";

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
  const changeElementTab = (context, resolve, reject) => {
    Click(elementSelector)(context).then(resolve, reject);
  };

  return function SelectElement(context) {
    return new Promise((resolve, reject) => {
      const promise = Check(elementSelector + ".selected")(context);
      promise.then(resolve, () => {
        changeElementTab(context, resolve, reject);
      });
    });
  };
}
