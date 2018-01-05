import Step from "../Step";

exports = module.exports = (env, process, coreConfig, config, require) => (options) => {
  options = options || {};

  const Wait = require("steps/Wait");
  const Timeout = require("steps/Timeout");
  const Support = require("steps/Support");
  return Step("Battle", async function Supporter() {
    const summonAttribute = options.summonAttribute || env.summonAttribute || config.Summons.DefaultSummonAttributeTab;
    const summonPreferred = options.summonPreferred || env.summonPreferred || config.Summons.PreferredSummons;
    const partyGroup = options.partyGroup || env.partyGroup || Number(config.PartySelection.PreferredPartyGroup);
    const partyDeck = options.partyDeck || env.partyDeck || Number(config.PartySelection.PreferredPartyDeck);

    return await process([
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
};

exports["@require"] = ["env", "process", "coreConfig", "config", "require"];

