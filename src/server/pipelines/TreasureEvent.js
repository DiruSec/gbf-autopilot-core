import {URL} from "url";

import coreConfig from "~/config";
import * as Location from "~/server/steps/Location";
import * as Battle from "~/server/steps/Battle";
import PipelineLoop from "~/server/steps/PipelineLoop";
import CheckItem from "~/server/steps/Quest/CheckItem";

export default function TreasureEventPipeline(env) {
  const config = this.config;
  const treasureRequired = coreConfig.treasureRequired;

  const url = new URL(config.TreasureEventMode.TreasureEventSoloUrl);
  const parts = url.hash.split("/");
  const itemId = parts[parts.length-1];

  const eventMode = [
    Location.Change(config.EventMode.EventRaidUrl),
    Battle.Supporter({
      url: config.EventMode.EventRaidUrl
    }, env),
    Battle.Loop(config.EventMode.EventRaidScript, env)
  ];

  const treasureEventMode = [
    Location.Change(url.toString()),
    Battle.Supporter({
      url: url.toString()
    }, env),
    Battle.Loop(config.TreasureEventMode.TreasureEventModeScript, env)
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
    PipelineLoop.call(this, TreasureEventPipeline, env)
  ];
}

TreasureEventPipeline.test = function() {
  return this.config.TreasureEventMode.Enabled;
};
