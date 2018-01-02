import Step from "../../Step";
import Wait from "../../Wait";

export default function(next) {
  return Step(function checkLocation({manager}, location) {
    if (!location.hash.startsWith("#raid")) return false;
    return manager.process([
      Wait(".btn-attack-start.display-on,.btn-result,.cnt-result"),
      next
    ]);
  });
}
