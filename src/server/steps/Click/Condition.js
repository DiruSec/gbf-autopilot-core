import isString from "lodash/isString";
import Step2 from "../Step2";

exports = module.exports = (logger, config, require, process, run) => (selector, condition, delay) => {
  delay = delay || config.reclickDelay;
  const Click = require("steps/Click");
  const Timeout = require("steps/Timeout");
  const Element = require("steps/Element");

  if (!condition) condition = selector;
  if (isString(condition)) {
    const conditionSelector = condition;
    condition = () => run(Element.Condition(selector, conditionSelector));
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

  const doClick = (done, fail) => {
    return process([
      Click(selector),
      Timeout(delay),
    ]).then(() => startClick(done, fail), fail);
  };

  const startClick = (done, fail) => {
    return wrapper().then(done, () => doClick(done, fail));
  };

  return Step2("Click", function Condition(_, done, fail) {
    logger.debug("Clicking with condition:", selector);
    startClick(done, fail);
  });
};

exports["@require"] = ["logger", "coreConfig", "require", "process", "run"];
