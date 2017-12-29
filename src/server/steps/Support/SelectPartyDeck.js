import {createProcess} from "../Helper";
import Check from "../Check";
import Click from "../Click";

const getPartyDeckSelector = (deck) => {
  return `.prt-deck-slider li:nth-child(${deck}) > a`;
};

export default function(deck) {
  const partyDeckSelector = getPartyDeckSelector(deck);
  return createProcess("Support.SelectPartyDeck", (context, lastResult, done, fail) => {
    const promise = Check(partyDeckSelector + ".flex-active")(context);
    promise.then(done, () => {
      Click(partyDeckSelector)(context).then(done, fail);
    });
  });
}
