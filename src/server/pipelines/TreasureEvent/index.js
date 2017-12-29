import coreConfig from "~/config";

import Wait from "~/server/steps/Wait";
import Timeout from "~/server/steps/Timeout";
import Location from "~/server/steps/Location";
import Support from "~/server/steps/Support";
import Stop from "~/server/steps/Stop";

export default function TreasureEventPipeline() {
  const config = this.config;
  if (!config.TreasureEventMode.Enabled) return false;

  return [
    Location.Change(config.TreasureEventMode.TreasureEventSoloUrl),
    Timeout(coreConfig.redirectDelay),

    Wait(".atx-lead-link"),
    Support.SelectElement(config.Summons.DefaultSummonAttributeTab),
    Timeout(coreConfig.scrollDelay),   
    Support.SelectSummon(config.Summons.PreferredSummons),

    Wait(".pop-deck.supporter"),
    Timeout(coreConfig.popupDelay),
    Support.SelectPartyGroup(Number(config.PartySelection.PreferredPartyGroup)),
    Timeout(coreConfig.popupDelay),   
    Support.SelectPartyDeck(Number(config.PartySelection.PreferredPartyDeck)),

    Support.StartBattle(),
    Stop()
  ];
}
