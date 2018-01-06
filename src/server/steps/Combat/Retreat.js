import Step from "../Step";

exports = module.exports = function(require, run) {
  const WaitForAjax = require("steps/WaitForAjax");
  const Location = require("steps/Location");
  const Click = require("steps/Click");

  return Step("Combat", async function Retreat() {
    const fail = (err) => {
      throw err;
    };

    var hasRetreated = false;
    var hasRedirected = false;

    run(WaitForAjax("/retire.json")).then(() => hasRetreated = true, fail);
    run(Location.Wait()).then(() => hasRedirected = true, fail);

    await run(Click.Condition(".btn-raid-menu.menu", "!.pop-raid-menu.pop-show"));
    await run(Click.Condition(".btn-withdrow", "!.pop-result-withdraw.pop-show"));
    await run(Click.Condition(".pop-result-withdraw .btn-usual-ok", () => hasRetreated));
    await run(Click.Condition(".btn-result", () => hasRedirected));
  });
};

exports["@require"] = ["require", "run"];
