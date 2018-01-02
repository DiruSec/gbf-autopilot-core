import {URL} from "url";

import coreConfig from "~/config";
import * as Battle from "~/server/steps/Battle";
import PipelineLoop from "~/server/steps/PipelineLoop";
import OpenQuestPage from "~/server/steps/Quest/OpenPage";
import CheckItem from "~/server/steps/Quest/CheckItem";

export default function TreasureEventPipeline(env) {
  const config = this.config;
  const treasureRequired = coreConfig.treasureRequired;

  const url = new URL(config.TreasureEventMode.TreasureEventSoloUrl);
  const parts = url.hash.split("/");
  const itemId = parts[parts.length-1];

  const eventMode = [
    OpenQuestPage(env, config.EventMode.EventRaidUrl),
    Battle.Supporter(env),
    Battle.Loop(env, config.EventMode.EventRaidScript)
  ];

  const treasureEventMode = [
    OpenQuestPage(env, url.toString()),
    Battle.Supporter(env),
    Battle.Loop(env, config.TreasureEventMode.TreasureEventModeScript)
  ];

  function checkQuest({manager}) {
    return manager.process([
      CheckItem(itemId),
      function checkTreasure(context, count) {
        return manager.process(count >= treasureRequired ?
          treasureEventMode : eventMode);
      }
    ]);
  }

  return [
    checkQuest,
    PipelineLoop.call(this, env, TreasureEventPipeline)
  ];
}

TreasureEventPipeline.test = function() {
  return this.config.TreasureEventMode.Enabled;
};
