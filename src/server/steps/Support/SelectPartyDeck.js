import {createProcess} from "../Helper";
import * as Click from "../Click";

const getPartyDeckSelector = (deck) => {
  return `.prt-deck-slider li:nth-child(${deck}) > a`;
};

export default function(deck) {
  const partyDeckSelector = getPartyDeckSelector(deck);
  return createProcess("Support.SelectPartyDeck", function(context) {
    this.logger.debug("Using party deck:", deck);
    return Click.Condition(partyDeckSelector, partyDeckSelector + ".flex-active")
      .call(this, context);
  });
}
