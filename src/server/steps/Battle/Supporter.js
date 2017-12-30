import coreConfig from "~/config";
import {createProcess} from "../Helper";

import Wait from "../Wait";
import Timeout from "../Timeout";
import * as Support from "../Support";

export default function Supporter(options) {
  options = options || {};
  return createProcess("Battle.Supporter", function({manager}) {
    const config = this.config;
    const summonAttribute = options.summonAttribute || config.Summons.DefaultSummonAttributeTab;
    const summonPreferred = options.summonPreferred || config.Summons.PreferredSummons;
    const partyGroup = options.partyGroup || Number(config.PartySelection.PreferredPartyGroup);
    const partyDeck = options.partyDeck || Number(config.PartySelection.PreferredPartyDeck);

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
