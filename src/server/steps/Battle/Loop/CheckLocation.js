import Step from "../../Step";

exports = module.exports = (process, require) => (next) => {
  const Wait = require("steps/Wait");
  return Step(function checkLocation(_, location) {
    if (!location.hash.startsWith("#raid")) return false;
    return process([
      Wait(".btn-attack-start.display-on,.btn-result,.cnt-result"),
      next
    ]);
  });
};

exports["@require"] = ["process", "require"];
