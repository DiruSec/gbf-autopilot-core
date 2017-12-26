import Check from "../Check";
import Click from "../Click";

const getPartyDeckSelector = (deck) => {
  return `.prt-deck-slider li:nth-child(${deck}) > a`;
};

export default function(deck) {
  const partyDeckSelector = getPartyDeckSelector(deck);
  return function SelectPartyGroup(context) {
    return new Promise((resolve, reject) => {
      const promise = Check(partyDeckSelector + ".flex-active")(context);
      promise.then(resolve, () => {
        Click(partyDeckSelector)(context).then(resolve, reject);
      });
    });
  };
}
