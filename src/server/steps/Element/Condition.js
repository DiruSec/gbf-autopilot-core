import isString from "lodash/isString";
import Step2 from "../Step2";

exports = module.exports = (require, run) => (selector, condition) => {
  const Check = require("steps/Check");

  if (!condition) condition = selector;
  if (isString(condition)) {
    var inversed = false;
    if (condition.startsWith("!")) {
      inversed = true;
      condition = condition.substring(1);
    }

    // clicks as long as the element exists
    // if inversed, clicks until the expected element exists
    const selectorCondition = condition;
    condition = () => new Promise((resolve, reject) => {
      run(Check(selectorCondition)).then(
        !inversed ? reject : resolve,
        !inversed ? resolve : reject
      );
    });
  }

  return Step2("Element", function Condition(_, done, fail) {
    const result = condition();
    if (result instanceof Promise) {
      return result.then(done, fail);
    } else if (result instanceof Error || !result) {
      return fail(result);
    } else {
      return done(result);
    }
  });
};
exports["@require"] = ["require", "run"];
