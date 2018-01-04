import * as Click from "../Click";
import Step from "../Step";

const partyGroupPrefix = ".btn-select-group.id-";

exports = module.exports = function(run, logger, group) {
  const partyGroupSelector = partyGroupPrefix + group;
  const toCheck = partyGroupSelector + ".selected";
  return Step("Support.SelectPartyGroup", async () => {
    logger.debug("Using party group:", group);
    return await run(Click.Condition, partyGroupSelector, "!" + toCheck);
  });
};

exports["@require"] = ["run", "logger"];
