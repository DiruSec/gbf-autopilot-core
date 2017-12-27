import forEach from "lodash/forEach";
import Character from "./Models/Character";

export default function(context, state, asyncWrapper) {
  const scriptGlobals = {
    characters: {},
    friend_summon_name: (state.summons[5] || {}).name,
    log(msg) {
      context.server.logger.debug(msg);
    }
  };

  forEach(state.party, (data, idx) => {
    const chara = Character(context, data, idx, asyncWrapper);
    const key = "character_" + chara.index;
    scriptGlobals.characters[chara.name] = scriptGlobals[key] = chara;
  });

  return scriptGlobals;
}
