import Step from "../Step";

exports = module.exports = function(require) {
  const WaitForAjax = require("steps/WaitForAjax");
  const Location = require("steps/Location");
  const Click = require("steps/Click");

  return Step("Combat", async function Retreat() {
    const fail = (err) => {
      throw err;
    };

    var hasRetreated = false;
    var hasRedirected = false;

    WaitForAjax("/retire.json").then(() => hasRetreated = true, fail);
    Location.Wait().then(() => hasRedirected = true, fail);

    await Click.Condition(".btn-raid-menu.menu", "!.pop-raid-menu.pop-show");
    await Click.Condition(".btn-withdrow", "!.pop-result-withdraw.pop-show");
    await Click.Condition(".pop-result-withdraw .btn-usual-ok", () => hasRetreated);
    await Click.Condition(".btn-result", () => hasRedirected);
  });
};

exports["@require"] = ["require"];
