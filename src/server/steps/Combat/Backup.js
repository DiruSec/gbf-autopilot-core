import Step from "../Step";

exports = module.exports = (process, require, run, worker) => (options, friend, guild) => {
  var all = options;
  if (typeof options === "object") {
    all = !!options.all;
    friend = !!options.friend;
    guild = !!options.guild;
    //twitter = !!options.twitter;
  }

  const State = require("steps/Battle/State");
  const Click = require("steps/Click");
  const Check = require("steps/Check");
  const Wait = require("steps/Wait");

  const clickIf = (type, state) => (assist) => {
    // the button state already set to the expected state
    const active = assist[type];
    if (active != state) return assist;

    const selector = ".pop-start-assist .btn-check." + type;
    const condition = selector + "[active='" + active + "']";
    return run(Click.Condition(selector, condition)).then(() => assist);
  };

  const checkBattle = () => {
    return run(State()).then((state) => {
      if (!state.is_multi) return false;

      return process([
        Click.Condition(".btn-assist", "!.pop-usual.pop-start-assist"),
        () => worker.sendAction("battle.assist"),
        clickIf("all", all),
        clickIf("friend", friend),
        clickIf("guild", guild),
        // TODO: handle twitter option
        () => run(Check(".btn-usual-text.disable")).then(() => process([
          Click.Condition(".btn-usual-cancel", ".pop-usual"),
        ]), () => process([
          Click.Condition(".btn-usual-text", "!.pop-usual.pop-raid-assist"),
          Click.Condition(".btn-usual-ok", ".pop-usual")
        ]))
      ]).then(() => true);
    });
  };

  return Step("Combat", function Backup() {
    return process([
      Wait(".btn-attack-start.display-on"),
      checkBattle
    ]);
  });
};
exports["@require"] = ["process", "require", "run", "worker"];
