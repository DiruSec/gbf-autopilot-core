import forEach from "lodash/forEach";
import isFunction from "lodash/isFunction";
import isUndefined from "lodash/isUndefined";

export default function Step(ns, callback, options) {
  if (isFunction(ns)) {
    options = callback;
    callback = ns;
    ns = null;
  }
  options = options || {};
  if (!ns && !callback.name) {
    options.name = "<anonymous>";
  } else {
    options.name = ns + (callback.name ? "." + callback.name : "");
  }

  function process(context, lastResult) {
    return new Promise((resolve, reject) => {
      const result = callback.call(this, context, lastResult, resolve, reject);
      if (result instanceof Promise) {
        result.then(resolve, reject);
      } else if (result instanceof Error) {
        reject(result);
      } else if (!isUndefined(result)) {
        resolve(result);
      }
    });
  }

  forEach(options || {}, (value, name) => {
    Object.defineProperty(process, name, {value});
  });
  return process;
}
