export function createProcess(name, callback) {
  function process(context, lastResult) {
    return new Promise((resolve, reject) => {
      const result = callback.call(this, context, lastResult, resolve, reject);
      if (result instanceof Promise) {
        result.then(resolve, reject);
      }
    });
  }

  Object.defineProperty(process, "name", {value: name});
  return process;
}
