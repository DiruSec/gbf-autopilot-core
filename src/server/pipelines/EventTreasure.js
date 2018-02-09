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

  const raidUrlSet = !!config.EventTreasureMode.EventTreasureRaidUrl;
  const treasureRequired = coreConfig.treasureRequired;
  const url = new URL(config.EventTreasureMode.EventTreasureRaidUrl);
  const parts = url.hash.split("/");
  const itemId = parts[parts.length - 1];

  const treasureSoloMode = () => {
    env.questUrl = config.EventTreasureMode.EventTreasureSoloUrl;
    env.luaScript = config.EventTreasureMode.EventTreasureSoloModeScript;
  };

  const treasureRaidMode = () => {
    env.questUrl = config.EventTreasureMode.EventTreasureRaidUrl;
    env.luaScript = config.EventTreasureMode.EventTreasureRaidModeScript;
  };

  const nightmareMode = () => {
    env.questUrl = config.EventTreasureMode.NightmareModeUrl;
    env.luaScript = config.EventTreasureMode.NightmareModeScript;
    env.summonPreferred =
      config.EventTreasureMode.NightmareModePreferredSummons;
    env.summonAttribute =
      config.EventTreasureMode.NightmareModeSummonAttributeTab;
    env.summonReroll =
      config.EventTreasureMode.RerollSummonWhenNoPreferredSummonWasFoundForNightmareMode;
    env.partyGroup = Number(
      config.PartySelection.PreferredNightmareModePartyGroup
    );
    env.partyDeck = Number(
      config.PartySelection.PreferredNightmareModePartyDeck
    );
    env.partySet = config.PartySelection.PreferredNightmareModePartySet;
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
    Location.Change(config.EventTreasureMode.EventTreasureUrl),
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
