import {URL} from "url";
import noop from "lodash/noop";
import coreConfig from "~/config";
import {createProcess} from "../Helper";

import * as Support from "../Support";
import CheckAP from "../Quest/CheckAP";
import Timeout from "../Timeout";
import Wait from "../Wait";

export default function Supporter(options, env) {
  options = options || {};
  env = env || {};

  const url = options.url || env.questUrl;
  return createProcess("Battle.Supporter", function({manager}) {
    const config = this.config;
    const summonAttribute = options.summonAttribute || config.Summons.DefaultSummonAttributeTab;
    const summonPreferred = options.summonPreferred || config.Summons.PreferredSummons;
    const partyGroup = options.partyGroup || Number(config.PartySelection.PreferredPartyGroup);
    const partyDeck = options.partyDeck || Number(config.PartySelection.PreferredPartyDeck);

    return manager.process([
      url ? CheckAP(url) : noop,
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
