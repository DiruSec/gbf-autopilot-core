import Step from "../../Step";
import {isBattlePage} from "~/helpers/LocationHelper";

exports = module.exports = (process, require) => (next) => {
  const Wait = require("steps/Wait");
  return Step(function checkLocation(_, location) {
    if (!isBattlePage(location)) return false;
    return process([
      Wait(".btn-attack-start.display-on,.btn-result,.cnt-result"),
      next
    ]);
  });
};

exports["@require"] = ["process", "require"];
