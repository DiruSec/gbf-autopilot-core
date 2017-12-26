import config from "~/config";
import Wait from "~/steps/Wait";
import Check from "~/steps/Check";
import Click from "~/steps/Click";
import Timeout from "~/steps/Timeout";
import Location from "~/steps/Location";

export default function() {
  function CheckLocation(context, location) {
    const manager = context.manager;
    return new Promise((resolve, reject) => {
      if (location.hash.startsWith("#raid")) {
        resolve();
        return;
      }

      Check("#loading")(context).then(() => {
        manager.process([
          CheckLocationBeforeBattle
        ]).then(resolve, reject);
      }, () => {
        manager.process([
          Click(".btn-usual-ok"),
          CheckLocationBeforeBattle
        ]).then(resolve, reject);
      });
    });
  }

  function CheckLocationBeforeBattle({manager}) {
    return manager.process([
      Timeout(config.redirectDelay),
      Location(),
      CheckLocation
    ]);
  }

  return function StartBattle({manager}) {
    return manager.process([
      Wait(".pop-deck.supporter .btn-usual-ok"),
      Click(".pop-deck.supporter .btn-usual-ok"),
      CheckLocationBeforeBattle,
      Wait(".btn-attack-start")
    ]);
  };
}
