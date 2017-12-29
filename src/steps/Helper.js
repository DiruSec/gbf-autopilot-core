export function createProcess(name, callback) {
  const process = function(context, lastResult) {
    return new Promise((resolve, reject) => {
      debugger;
      const result = callback.call(this, context, lastResult, resolve, reject);
      if (result instanceof Promise) {
        result.then(resolve, reject);
      }
    });
  };

  Object.defineProperty(process, "name", {value: name});
  return process;
}
