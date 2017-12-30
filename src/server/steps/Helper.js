import forEach from "lodash/forEach";

export function createProcess(name, callback, options) {
  options = options || {};
  options.name = name;

  function process(context, lastResult) {
    return new Promise((resolve, reject) => {
      const result = callback.call(this, context, lastResult, resolve, reject);
      if (result instanceof Promise) {
        result.then(resolve, reject);
      }
    });
  }

  forEach(options || {}, (value, name) => {
    Object.defineProperty(process, name, {value});
  });
  return process;
}
