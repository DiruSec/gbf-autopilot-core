import Step from "../Step";

exports = module.exports = (worker) => () => {
  return Step(function Location() {
    return worker.sendAction("location");
  });
};

exports.Change = require("./Change");
exports.Reload = require("./Reload");
exports.Wait = require("./Wait");
exports["@require"] = ["worker"];
