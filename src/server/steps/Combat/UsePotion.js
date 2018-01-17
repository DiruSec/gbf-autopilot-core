import noop from "lodash/noop";
import Step from "../Step";

exports = module.exports = (coreConfig, require, worker, process, run) => (potionNum, targetNum) => {
  potionNum = Number(potionNum);
  targetNum = Number(targetNum);

  const WaitForResult = require("steps/Combat/WaitForResult");
  const Timeout = require("steps/Timeout");
  const Check = require("steps/Check");
  const Click = require("steps/Click");
  const Wait = require("steps/Wait");
  const Key = require("steps/Key");

  const popupSelector = [".pop-raid-item", ".pop-event-item"];
  const waitForResult = (done, fail) => (success) => {
    if (!success) return done(false);
    return run(WaitForResult()).then(() => done(true), fail);
  };

  const checkTarget = (done, fail) => () => {
    const next = waitForResult(done, fail);
    if (targetNum) {
      const target = targetNum - 1;
      const selector = ".btn-command-character[pos='" + target + "']";
      return run(Click.Condition(selector, "!.pop-usual")).then(() => next(true));
    } else {
      return run(Wait(popupSelector)).then(() => {
        return run(Check(".btn-usual-use,.btn-usual-ok"));
      }).then(() => {
        return run(Key.Press("space")).then(() => next(true));
      }, () => {
        const selector = ".btn-usual-cancel";
        const condition = popupSelector.join(",");
        return run(Click.Condition(selector, condition)).then(() => next(false));
      });
    }
  };

  const selectPotion = () => {
    // apparently potionNum above 5 doesn't work with Viramate keybinding
    // (eg. revival potion)
    if (potionNum <= 5) {
      return run(Key.Press(potionNum));
    } else {
      const id = potionNum - 3;
      const selector = ".prt-event-item .lis-item[item-id='" + id + "']";
      const condition = popupSelector.map((selector) => {
        return selector + " .prt-select-item";
      }).join(",");
      return run(Click.Condition(selector, condition));
    }
  };

  const checkPotionAvailable = (potion) => {
    var amount = 0;
    if (potionNum == 1) {
      // green potion
      amount = Number(potion.normal.small);
    } else if (potionNum == 2) {
      // blue potion
      amount = Number(potion.normal.large);
    } else if (potionNum == 3) {
      // in case of HL raids without full elixir allowed
      // TODO: check limit_number & limit_remain
      if (!potion.full.limit_flg) return false;
      amount = Number(potion.full.count);
    } else if (potionNum <= 6) {
      // for now only works for GW events
      // TODO: make special potion also works for Arcarum
      if (potion.event.event_type != 3) return false;
      const num = potionNum - 3;
      const item = potion.event.item[num] || {number: 0};
      amount = Number(item.number);
    }
    return amount > 0;
  };

  const checkPotion = (done, fail) => () => {
    return worker.sendAction("battle.potion").then((potion) => {
      if (!checkPotionAvailable(potion)) {
        return done(false);
      }
      return process([
        Key.Press("H"), Timeout(coreConfig.popupDelay),
        selectPotion, Timeout(coreConfig.popupDelay),
        checkTarget(done, fail)
      ]);
    });
  };

  return Step("Combat", function UsePotion(_, $, done, fail) {
    process([
      Wait(".btn-attack-start.display-on"),
      checkPotion(done, fail),
    ]).then(noop, fail);
  });
};
exports["@require"] = ["coreConfig", "require", "worker", "process", "run"];
