import Step from "./Step";

module.exports = function Step2(ns, callback, options) {
  if (typeof ns === "function") {
    options = callback;
    callback = ns;
    ns = null;
  }
  const wrapper = (context, lastResult, done, fail) => {
    return callback.call(this, lastResult, done, fail);
  };
  Object.defineProperty(wrapper, "name", {value: callback.name});
  return Step(ns, wrapper, options);
};
