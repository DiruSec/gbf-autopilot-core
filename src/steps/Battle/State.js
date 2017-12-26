import {createProcess} from "../Helper";
import Viramate from "../Viramate";
import assign from "lodash/assign";
import forEach from "lodash/forEach";
import values from "lodash/values";

export default function() {
  return createProcess("Battle.State", (context, lastResult, done, fail) => {
    const worker = context.worker;
    const result = {};
    Viramate({type: "getCombatState"})(context).then((state) => {
      assign(result, state);
      return worker.sendAction("battle.state");
    }).then((state) => {
      forEach(state.party, (chara, num) => {
        const idx = Number(num) - 1;
        result.party[idx].skills = values(chara);
      });

      result.summons = values(state.summons);
      return worker.sendAction("battle.count");
    }).then((count) => {
      result.battle = count;
      done(result);
    }, fail);
  });
}
