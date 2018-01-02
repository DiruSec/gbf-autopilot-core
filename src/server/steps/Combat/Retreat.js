import * as Location from "../Location";
import * as Click from "../Click";
import WaitForAjax from "../WaitForAjax";
import Step from "../Step";

export default function() {
  return Step("Combat.Retreat", function(context, $, done, fail) {
    const manager = context.manager;

    var hasRetreated = false;
    WaitForAjax("/retire.json")
      .call(this, context)
      .then(() => hasRetreated = true, fail);

    var hasRedirected = false;
    Location.Wait()
      .call(this, context)
      .then(() => hasRedirected = true, fail);

    manager.process([
      Click.Condition(".btn-raid-menu.menu", "!.pop-raid-menu.pop-show"),
      Click.Condition(".btn-withdrow", "!.pop-result-withdraw.pop-show"),
      Click.Condition(".pop-result-withdraw .btn-usual-ok", () => hasRetreated),
      Click.Condition(".btn-result", () => hasRedirected)
    ]).then(done, fail);
  });
}
