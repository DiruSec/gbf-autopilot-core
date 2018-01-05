import Step from "../Step";

const getPartyDeckSelector = (deck) => {
  return `.prt-deck-slider li:nth-child(${deck}) > a`;
};

exports = module.exports = (require, logger) => (deck) => {
  const Click = require("steps/Click");
  const partyDeckSelector = getPartyDeckSelector(deck);
  const toCheck = partyDeckSelector + ".flex-active";
  return Step("Support.SelectPartyDeck", async () => {
    logger.debug("Using party deck:", deck);
    return await Click.Condition(partyDeckSelector, "!" + toCheck);
  });
};

exports["@require"] = ["require", "logger"];
