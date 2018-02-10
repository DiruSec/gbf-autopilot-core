import { URL } from "url";

exports = module.exports = (
  env,
  config,
  coreConfig,
  process,
  require,
  run
) => () => {
  const Wait = require("steps/Wait");
  const Check = require("steps/Check");
  const Location = require("steps/Location");
  const CheckItem = require("steps/Quest/CheckItem");
  const DefaultPipeline = require("pipelines/Default");

  const raidUrlSet = !!config.get("EventTreasureMode.EventTreasureRaidUrl");
  const treasureRequired = coreConfig.treasureRequired;
  const url = new URL(config.get("EventTreasureMode.EventTreasureRaidUrl"));
  const parts = url.hash.split("/");
  const itemId = parts[parts.length - 1];

  const treasureSoloMode = () => {
    env.questUrl = config.get("EventTreasureMode.EventTreasureSoloUrl");
    env.luaScript = config.get("EventTreasureMode.EventTreasureSoloModeScript");
  };

  const treasureRaidMode = () => {
    env.questUrl = config.get("EventTreasureMode.EventTreasureRaidUrl");
    env.luaScript = config.get("EventTreasureMode.EventTreasureRaidModeScript");
  };

  const nightmareMode = () => {
    env.questUrl = config.get("EventTreasureMode.NightmareModeUrl");
    env.luaScript = config.get("EventTreasureMode.NightmareModeScript");
    env.summonPreferred = config.get(
      "EventTreasureMode.NightmareModePreferredSummons"
    );
    env.summonAttribute = config.get(
      "EventTreasureMode.NightmareModeSummonAttributeTab"
    );
    env.summonReroll = config.get(
      "EventTreasureMode.RerollSummonWhenNoPreferredSummonWasFoundForNightmareMode"
    );
    env.partyGroup = Number(
      config.get("PartySelection.PreferredNightmareModePartyGroup")
    );
    env.partyDeck = Number(
      config.get("PartySelection.PreferredNightmareModePartyDeck")
    );
    env.partySet = config.get("PartySelection.PreferredNightmareModePartySet");
  };

  const checkTreasure = (count, isNightmare) => {
    env.questCount = 0;
    env.questMax = 1;
    if (isNightmare) {
      nightmareMode();
    } else {
      if (raidUrlSet && count >= treasureRequired) {
        treasureRaidMode();
      } else {
        treasureSoloMode();
      }
    }
    return true;
  };

  const checkNightmare = (context, count) =>
    new Promise((resolve, reject) => {
      return run(Check(".btn-quest-list.hell"))
        .then(
          () => checkTreasure(count, true),
          () => checkTreasure(count, false)
        )
        .then(resolve, reject);
    });

  const checkQuest = () => process([CheckItem(itemId), checkNightmare]);

  const steps = [
    Location.Change(config.get("EventTreasureMode.EventTreasureUrl")),
    Wait(".atx-lead-link"),
    checkQuest,
    () => process(DefaultPipeline()),
    () => process(steps)
  ];

  return steps;
};

exports.test = (config, scenarioConfig) =>
  scenarioConfig.get("Mode") === "EventTreasure" ||
  config.get("EventTreasureMode.Enabled");
exports["@require"] = [
  "env",
  "config",
  "coreConfig",
  "process",
  "require",
  "run"
];
exports["@name"] = "Event Treasure";
