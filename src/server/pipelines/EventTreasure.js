import {URL} from "url";

exports = module.exports = (env, config, coreConfig, process, require) => () => {
  const Location = require("steps/Location");
  const CheckItem = require("steps/Quest/CheckItem");
  const DefaultPipeline = require("pipelines/Default");

  const treasureRequired = coreConfig.treasureRequired;
  const url = new URL(config.EventTreasureMode.EventTreasureRaidUrl);
  const parts = url.hash.split("/");
  const itemId = parts[parts.length-1];

  const treasureSoloMode = () => {
    env.questUrl = config.EventTreasureMode.EventTreasureSoloUrl;
    env.luaScript = config.EventTreasureMode.EventTreasureSoloModeScript;
  };

  const treasureRaidMode = () => {
    env.questUrl = config.EventTreasureMode.EventTreasureRaidUrl;
    env.luaScript = config.EventTreasureMode.EventTreasureRaidModeScript;
  };

  const checkTreasure = (context, count) => {
    config.EventTreasureMode.EventTreasureRaidUrl && count >= treasureRequired ?
      treasureRaidMode() : treasureSoloMode();
    env.questCount = 0;
    env.questMax = 1;
    return true;
  };

  const checkQuest = () => process([
    CheckItem(itemId),
    checkTreasure
  ]);

  const steps = [
    Location.Change(config.EventTreasureMode.EventTreasureUrl),
    checkQuest,
    () => process(DefaultPipeline()),
    () => process(steps)
  ];

  return steps;
};


exports.test = (config) => config.EventTreasureMode.Enabled;
exports["@require"] = ["env", "config", "coreConfig", "process", "require"];
exports["@name"] = "Event Treasure";
