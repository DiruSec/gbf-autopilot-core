import {URL} from "url";

exports = module.exports = (env, config, coreConfig, process, require) => {
  const Location = require("steps/Location");
  const CheckItem = require("steps/Quest/CheckItem");
  const DefaultPipeline = require("pipelines/Default");

  const treasureRequired = coreConfig.treasureRequired;
  const url = new URL(config.TreasureEventMode.TreasureEventSoloUrl);
  const parts = url.hash.split("/");
  const itemId = parts[parts.length-1];

  const treasureSoloMode = () => {
    env.questUrl = config.TreasureEventMode.TreasureEventSoloUrl;
    env.luaScript = config.TreasureEventMode.TreasureEventSoloModeScript;
  };

  const treasureRaidMode = () => {
    env.questUrl = config.TreasureEventMode.TreasureEventRaidUrl;
    env.luaScript = config.TreasureEventMode.TreasureEventRaidModeScript;
  };

  const checkTreasure = (context, count) => {
    config.TreasureEventMode.TreasureEventRaidUrl && count >= treasureRequired ?
      treasureRaidMode() : treasureSoloMode();
    env.questCount = 0;
    env.maxQuest = 1;
    return true;
  };

  const checkQuest = () => process([
    CheckItem(itemId),
    checkTreasure
  ]);

  const steps = [
    Location.Change(config.TreasureEventMode.TreasureEventUrl),
    checkQuest,
    () => process(DefaultPipeline),
    () => process(steps)
  ];

  return steps;
};


exports.test = (config) => () => {
  return config.TreasureEventMode.Enabled;
};
exports.test["@require"] = ["config"];
exports["@require"] = ["env", "config", "coreConfig", "process", "require"];
