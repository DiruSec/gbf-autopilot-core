import * as Click from "../Click";
import Step from "../Step";

const getPartyDeckSelector = (deck) => {
  return `.prt-deck-slider li:nth-child(${deck}) > a`;
};

exports = module.exports = function(run, logger, deck) {
  const partyDeckSelector = getPartyDeckSelector(deck);
  const toCheck = partyDeckSelector + ".flex-active";
  return Step("Support.SelectPartyDeck", async () => {
    logger.debug("Using party deck:", deck);
    return await run(Click.Condition, partyDeckSelector, "!" + toCheck);
  });
};

exports["@require"] = ["run", "logger"];
