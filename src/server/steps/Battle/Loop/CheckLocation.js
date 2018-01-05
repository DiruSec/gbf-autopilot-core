import Step from "../../Step";
import Wait from "../../Wait";

exports = module.exports = function(process, next) {
  return Step(function checkLocation(_, location) {
    if (!location.hash.startsWith("#raid")) return false;
    return process([
      [Wait, ".btn-attack-start.display-on,.btn-result,.cnt-result"],
      next
    ]);
  });
};

exports["@require"] = ["process"];
