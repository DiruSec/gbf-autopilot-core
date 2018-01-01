import {createProcess} from "../Helper";
import * as Click from "../Click";
import Check from "../Check";

const getPartyDeckSelector = (deck) => {
  return `.prt-deck-slider li:nth-child(${deck}) > a`;
};

export default function(deck) {
  const partyDeckSelector = getPartyDeckSelector(deck);
  return createProcess("Support.SelectPartyDeck", function(context) {
    this.logger.debug("Using party deck:", deck);
    return Click.Condition(partyDeckSelector, () => {
      return Check(partyDeckSelector + ".flex-active").call(this, context);
    }).call(this, context);
  });
}
