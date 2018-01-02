import isObject from "lodash/isObject";
import Step from "../Step";
export Condition from "./Condition";

export default function Click(selector) {
  return Step("Click", function() {
    if (isObject(selector)) { 
      // asume the selector argument contains the element data
      return this.server.makeRequest("click", selector);
    }
    this.logger.debug("Clicking element:", selector);
    return this.sendAction("element", {selector, retry: true}).then((payload) => {
      return this.server.makeRequest("click", payload);
    });
  });
}

export const Normal = Click;
