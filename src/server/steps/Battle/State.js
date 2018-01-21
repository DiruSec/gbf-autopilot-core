import forEach from "lodash/forEach";
import values from "lodash/values";
import Step from "../Step";

exports = module.exports = (worker, require, run) => () => {
  const Viramate = require("steps/Viramate");
  return Step("Battle", async function State() {
    const vmState = await run(Viramate({type: "getCombatState"}));
    const state = await worker.sendAction("battle.state");
    const count = await worker.sendAction("battle.count");
    const potion = await worker.sendAction("battle.potion");
    const result = vmState;

    forEach(state.party, (chara, num) => {
      const idx = Number(num) - 1;
      result.party[idx].skills = values(chara);
    });
    result.summons = values(state.summons);
    result.battle = count;
    result.potion = potion;
    return result;
  });
};

exports["@require"] = ["worker", "require", "run"];
