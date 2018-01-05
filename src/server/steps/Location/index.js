import Step from "../Step";

exports = module.exports = (worker) => () => {
  return Step(async function Location() {
    return await worker.sendAction("location");
  });
};

exports.Get = exports;
exports.Change = require("./Change");
exports.Reload = require("./Reload");
exports.Wait = require("./Wait");
exports["@require"] = ["worker"];
