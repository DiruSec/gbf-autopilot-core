import coreConfig from "~/config";
import {Step} from "../Helper";

import * as Support from "../Support";
import Timeout from "../Timeout";
import Wait from "../Wait";

export default function Supporter(env, options) {
  options = options || {};
  env = env || {};

  return Step("Battle.Supporter", function({manager}) {
    const config = this.config;
    const summonAttribute = options.summonAttribute || env.summonAttribute || config.Summons.DefaultSummonAttributeTab;
    const summonPreferred = options.summonPreferred || env.summonPreferred || config.Summons.PreferredSummons;
    const partyGroup = options.partyGroup || env.partyGroup || Number(config.PartySelection.PreferredPartyGroup);
    const partyDeck = options.partyDeck || env.partyDeck || Number(config.PartySelection.PreferredPartyDeck);

    return manager.process([
      Wait(".atx-lead-link"),
      Support.SelectElement(summonAttribute),
      Timeout(coreConfig.scrollDelay),   
      Support.SelectSummon(summonPreferred),

      Wait(".pop-deck.supporter"),
      Timeout(coreConfig.popupDelay),
      Support.SelectPartyGroup(partyGroup),
      Timeout(coreConfig.popupDelay),   
      Support.SelectPartyDeck(partyDeck),
      Support.StartBattle(),
    ]);
  });
}
