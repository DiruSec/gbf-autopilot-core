import isFunction from "lodash/isFunction";
import coreConfig from "~/config";
import {createProcess} from "../Helper";
import Timeout from "../Timeout";
import Click from "./index";

export default function Condition(selector, condition, delay) {
  if (!condition || !isFunction(condition)) {
    throw new Error("Condition parameter must be a callback!");
  }
  delay = delay || coreConfig.redirectDelay;
  return createProcess("Click.Condition", function(context, $, done, fail) {
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
