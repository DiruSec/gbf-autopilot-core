import coreConfig from "~/config";
import Stop from "~/steps/Stop";
import Loop from "~/steps/Loop";
import Wait from "~/steps/Wait";
import Timeout from "~/steps/Timeout";
import LocationChange from "~/steps/LocationChange";
import Support from "~/steps/Support";

export default function(server) {
  const config = server.config;
  return [
    LocationChange(config.TreasureEventMode.TreasureEventSoloUrl),
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
    Loop()
  ];
}
