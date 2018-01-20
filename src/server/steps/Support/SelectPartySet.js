import Step from "../Step";

exports = module.exports = (require, run, logger) => (partySet) => {
  partySet = partySet.toUpperCase();
  const Click = require("steps/Click");
  return Step("Support", function SelectPartySet() {
    logger.debug("Using party set:", partySet);
    const selector = ".btn-deck-group.type-group" + partySet;
    return run(Click.Condition(".btn-deck-group", "!" + selector));
  });
};
exports["@require"] = ["require", "run", "logger"];
