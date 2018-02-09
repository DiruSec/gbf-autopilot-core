exports = module.exports = (
  env,
  config,
  scenarioConfig,
  exec,
  require,
  run
) => () => {
  const Wait = require("steps/Wait");
  const Check = require("steps/Check");
  const Location = require("steps/Location");
  const DefaultPipeline = require("pipelines/Default");

  const questUrl =
    scenarioConfig.get("Quest.Url") || config.EventMode.EventRaidUrl;
  const eventPageUrl =
    scenarioConfig.get("Event.Url") || config.EventMode.EventPageUrl;
  const nightmareQuestUrl =
    scenarioConfig.get("Nightmare.Quest.Url") ||
    config.get("EventMode.NightmareModeUrl");

  const eventMode = () => {
    delete env.summonPreferred;
    delete env.summonAttribute;
    delete env.partyGroup;
    delete env.partyDeck;

    env.questUrl = questUrl;
    env.luaScript =
      scenarioConfig.get("Lua.Script") ||
      config.get("EventMode.EventRaidScript");
    env.questCount = 0;
    env.questMax = 1;
    return env;
  };

  const nightmareMode = () => {
    env.questUrl = nightmareQuestUrl;
    env.luaScript =
      scenarioConfig.get("Nightmare.Lua.Script") ||
      scenarioConfig.get("Lua.Script") ||
      config.get("EventMode.NightmareModeScript");
    env.summonPreferred =
      scenarioConfig.get("Nightmare.Summon.Preferred") ||
      scenarioConfig.get("Summon.Preferred") ||
      config.get("EventMode.NightmareModePreferredSummons");
    env.summonAttribute =
      scenarioConfig.get("Nightmare.Summon.Attribute") ||
      scenarioConfig.get("Summon.Attribute") ||
      config.get("EventMode.NightmareModeSummonAttributeTab");
    env.summonReroll =
      scenarioConfig.get("Nightmare.Summon.Reroll") ||
      scenarioConfig.get("Summon.Reroll") ||
      config.get(
        "EventMode.RerollSummonWhenNoPreferredSummonWasFoundForNightmareMode"
      );
    env.partyGroup =
      scenarioConfig.get("Nightmare.Party.Group") ||
      scenarioConfig.get("Party.Group") ||
      Number(config.get("PartySelection.PreferredNightmareModePartyGroup"));
    env.partyDeck =
      scenarioConfig.get("Nightmare.Party.Deck") ||
      scenarioConfig.get("Party.Deck") ||
      Number(config.get("PartySelection.PreferredNightmareModePartyDeck"));
    env.partySet =
      scenarioConfig.get("Nightmare.Party.Set") ||
      scenarioConfig.get("Party.Set") ||
      config.get("PartySelection.PreferredNightmareModePartySet");
    env.questCount = 0;
    env.questMax = 1;
    return env;
  };

  const steps = [
    Location.Change(eventPageUrl),
    Wait(".atx-lead-link"),
    function checkNightmare() {
      if (!nightmareQuestUrl) {
        return eventMode();
      }
      const selector = ".ico-difficulty-5,.ico-difficulty-8";
      return run(Check(selector)).then(nightmareMode, eventMode);
    },
    () => exec(DefaultPipeline()),
    () => exec(steps)
  ];

  return steps;
};

exports.test = (config, scenarioConfig) =>
  scenarioConfig.get("Mode") === "Event" || config.get("EventMode.Enabled");
exports["@require"] = [
  "env",
  "config",
  "scenarioConfig",
  "process",
  "require",
  "run"
];
exports["@name"] = "Event";
