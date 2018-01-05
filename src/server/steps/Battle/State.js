import forEach from "lodash/forEach";
import values from "lodash/values";
import Step from "../Step";

exports = module.exports = (worker, require) => () => {
  const Viramate = require("steps/Viramate");
  return Step("Battle", async function State() {
    const vmState = await Viramate({type: "getCombatState"});
    const state = await worker.sendAction("battle.state");
    const count = await worker.sendAction("battle.count");
    const result = vmState;

    forEach(state.party, (chara, num) => {
      const idx = Number(num) - 1;
      result.party[idx].skills = values(chara);
    });
    result.summons = values(state.summons);
    result.battle = count;
    return result;
  });
};

exports["@require"] = ["worker", "require"];
