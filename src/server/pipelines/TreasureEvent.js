import {URL} from "url";

import coreConfig from "~/config";
import * as Location from "~/server/steps/Location";
import PipelineLoop from "~/server/steps/PipelineLoop";
import CheckItem from "~/server/steps/Quest/CheckItem";
import DefaultPipeline from "./Default";

export default function TreasureEventPipeline(env) {
  const config = this.config;
  const treasureRequired = coreConfig.treasureRequired;

  const url = new URL(config.TreasureEventMode.TreasureEventSoloUrl);
  const parts = url.hash.split("/");
  const itemId = parts[parts.length-1];

  const treasureSoloMode = () => {
    env.questUrl = config.TreasureEventMode.TreasureEventSoloUrl;
    env.luaString = config.TreasureEventMode.TreasureEventModeScript;
  };

  const treasureRaidMode = () => {
    env.questUrl = config.TreasureEventMode.TreasureEventRaidUrl;
    env.luaString = config.TreasureEventMode.TreasureEventModeScript;
  };

  function checkQuest({manager}) {
    return manager.process([
      CheckItem(itemId),
      function checkTreasure(context, count) {
        config.TreasureEventMode.TreasureEventRaidUrl && count >= treasureRequired ?
          treasureRaidMode() : treasureSoloMode();
        env.questCount = 0;
        env.maxQuest = 1;
        return true;
      }
    ]);
  }

  return [
    Location.Change(config.TreasureEventMode.TreasureEventUrl),
    checkQuest,
    function runPipeline({manager}) {
      return manager.process(DefaultPipeline.call(this, env));
    },
    PipelineLoop.call(this, env, TreasureEventPipeline)
  ];
}

TreasureEventPipeline.test = function() {
  return this.config.TreasureEventMode.Enabled;
};
