import isString from "lodash/isString";
import Step2 from "../Step2";

exports = module.exports = (require, run) => (key, condition) => {
  const Element = require("steps/Element");
  const Timeout = require("steps/Timeout");
  const KeyPress = require("steps/Key/Press");

  if (isString(condition)) {
    const selector = condition;
    condition = () => run(Element.Condition(selector));
  }

  const wrapper = () => new Promise((resolve, reject) => {
    const result = condition();
    if (result instanceof Promise) {
      return result.then(resolve, reject);
    } else if (result instanceof Error || !result) {
      return reject(result);
    } else {
      return resolve(result);
    }
  });

  const doPress = (done, fail) => {
    return run(KeyPress(key)).then(() => {
      return run(Timeout(750));
    }).then(() => {
      return wrapper().then(done, () => doPress(done, fail));
    }, fail);
  };

  return Step2("Key", function Condition(_, done, fail) {
    wrapper().then(done, () => doPress(done, fail));
  });
};
exports["@require"] = ["require", "run"];
