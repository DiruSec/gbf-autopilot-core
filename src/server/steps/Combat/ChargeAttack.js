import {createProcess} from "../Helper";
import * as Key from "../Key";
import * as Battle from "../Battle";

export default function(enable) {
  return createProcess("Combat.ChargeAttack", function(context, _, done, fail) {
    this.logger.debug("Charge attack:", enable);
    const doToggle = () => Key.Press("c")(context).then(done, fail);
    Battle.State()(context).then((state) => {
      (enable && state.lock === 1) ||
      (!enable && state.lock === 0) ?
        doToggle() : done();
    });
  });
}
