export Change from "./Change";
export Reload from "./Reload";
export Wait from "./Wait";
import Step from "../Step";

exports = module.exports = function Location(worker) {
  return Step(async function Location() {
    return await worker.sendAction("location");
  });
};

exports.Get = Location;
exports["@require"] = ["worker"];
