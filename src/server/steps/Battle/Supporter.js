import Step from "../Step";

exports = module.exports = (
  env,
  process,
  scenarioConfig,
  coreConfig,
  config,
  require
) => options => {
  options = options || {};

  const Wait = require("steps/Wait");
  const Timeout = require("steps/Timeout");
  const Support = require("steps/Support");
  return Step("Battle", async function Supporter() {
    const summonAttribute =
      options.summonAttribute ||
      env.summonAttribute ||
      scenarioConfig.get("Summon.Attribute") ||
      config.get("Summons.DefaultSummonAttributeTab");
    const summonPreferred =
      options.summonPreferred ||
      env.summonPreferred ||
      scenarioConfig.get("Summon.Preferred") ||
      config.get("Summons.PreferredSummons");
    const summonReroll =
      options.summonReroll ||
      env.summonReroll ||
      scenarioConfig.get("Summon.Reroll") ||
      Boolean(config.get("Summons.RerollSummonWhenNoPreferredSummonWasFound"));
    const partyGroup =
      options.partyGroup ||
      env.partyGroup ||
      scenarioConfig.get("Party.Group") ||
      Number(config.get("PartySelection.PreferredPartyGroup"));
    const partyDeck =
      options.partyDeck ||
      env.partyDeck ||
      scenarioConfig.get("Party.Deck") ||
      Number(config.get("PartySelection.PreferredPartyDeck"));
    const partySet =
      options.partySet ||
      env.partySet ||
      scenarioConfig.get("Party.Set") ||
      config.get("PartySelection.PreferredPartySet");

    return await process([
      Wait(".atx-lead-link"),
      Support.SelectElement(summonAttribute),
      Timeout(coreConfig.scrollDelay),
      Support.SelectSummon(summonPreferred, summonReroll),

      Wait(".pop-deck.supporter,.pop-deck.supporter_raid"),
      Timeout(coreConfig.popupDelay),
      Support.SelectPartySet(partySet),
      Support.SelectPartyGroup(partyGroup),
      Timeout(coreConfig.popupDelay),
      Support.SelectPartyDeck(partyDeck),
      Support.StartBattle()
    ]);
  });
};

exports["@require"] = [
  "env",
  "process",
  "scenarioConfig",
  "coreConfig",
  "config",
  "require"
];
