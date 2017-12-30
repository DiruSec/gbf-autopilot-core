import config from "~/config";
import {createProcess} from "../Helper";
import Wait from "../Wait";
import Check from "../Check";
import Click from "../Click";
import Timeout from "../Timeout";
import Location from "../Location";

const CheckLocation = createProcess("Support.StartBattle.CheckLocation", (context, location, done, fail) => {
  const manager = context.manager;
  if (location.hash.startsWith("#raid")) {
    done();
    return;
  }

  Check("#loading")(context).then(() => {
    return manager.process([
      CheckLocationBeforeBattle
    ]);
  }, () => {
    return manager.process([
      Click(".btn-usual-ok"),
      CheckLocationBeforeBattle
    ]);
  }).then(done, fail);
});

const CheckLocationBeforeBattle = createProcess("Support.StartBattle.CheckLocationBeforeBattle", ({manager}) => {
  return manager.process([
    Timeout(config.redirectDelay),
    Location(),
    CheckLocation
  ]);
});

export default function() {
  return createProcess("Support.StartBattle", ({manager}) => {
    return manager.process([
      Wait(".pop-deck.supporter .btn-usual-ok"),
      Click(".pop-deck.supporter .btn-usual-ok"),
      CheckLocationBeforeBattle,
      Wait(".btn-attack-start.display-on")
    ]);
  });
}
