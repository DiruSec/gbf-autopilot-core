import noop from "lodash/noop";
import range from "lodash/range";
import assign from "lodash/assign";
import forEach from "lodash/forEach";

import Combat from "~/steps/Combat";

export default function(context, data, index) {
  const server = context.server;
  const errorHandler = ::server.defaultErrorHandler;
  const chara = assign({}, data, {
    index: index + 1,
    is_alive: data.alive,
    hp_percentage: data.hp / data.hpMax * 100,
    charge_gauge: data.ougi,

    UseSkill(skillIdx) {
      const promise = Combat.UseSkill(chara.index, skillIdx)(context);
      promise.then(noop, errorHandler);
    }
  });

  forEach(range(0, 4), (idx) => {
    const num = idx + 1;
    const key = "skill_" + num + "_available";
    chara[key] = data.skills[idx] ? data.skills[idx].available : false;
  });

  return chara;
}
