import isFunction from "lodash/isFunction";
import isString from "lodash/isString";
import coreConfig from "~/config";
import Timeout from "../Timeout";
import Check from "../Check";
import Step from "../Step";
import Click from "./index";

export default function Condition(selector, condition, delay) {
  if (!isFunction(condition) && !isString(condition)) {
    throw new Error("Condition parameter must be either a function or string!");
  }
  delay = delay || coreConfig.popupDelay;

  if (isString(condition)) {
    var inversed = false;
    if (condition.startsWith("!")) {
      inversed = true;
      condition = condition.substring(1);
    }

    // clicks as long as the element exists
    // if inversed, clicks until the expected element exists
    const selectorCondition = condition;
    condition = function(context) {
      return new Promise((resolve, reject) => {
        Check(selectorCondition).call(this, context).then(
          !inversed ? reject : resolve,
          !inversed ? resolve : reject
        );
      });
    };
  }

  return Step("Click.Condition", function(context, $, done, fail) {
    this.logger.debug("Clicking with condition:", selector);
    condition = condition.bind(this, context, $);

    const manager = context.manager;
    const doClick = (done, fail) => {
      return manager.process([
        Click(selector),
        Timeout(delay)
      ]).then(() => startClick(done, fail), fail);
    };
    const startClick = (done, fail) => {
      const result = condition();
      if (result instanceof Promise) {
        result.then(done, () => doClick(done, fail));
      } else {
        result ? done() : doClick(done, fail);
      }
    };

    startClick(done, fail);
  });
}
