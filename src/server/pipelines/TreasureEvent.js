import {URL} from "url";

import coreConfig from "~/config";
import * as Location from "~/server/steps/Location";
import * as Element from "~/server/steps/Element";
import * as Battle from "~/server/steps/Battle";
import PipelineLoop from "~/server/steps/PipelineLoop";
import OpenQuestPage from "~/server/steps/Quest/OpenPage";
import CheckItem from "~/server/steps/Quest/CheckItem";
import Wait from "~/server/steps/Wait";

export default function TreasureEventPipeline(env) {
  const config = this.config;
  const treasureRequired = coreConfig.treasureRequired;

  const url = new URL(config.TreasureEventMode.TreasureEventSoloUrl);
  const parts = url.hash.split("/");
  const itemId = parts[parts.length-1];
  const difficulty = config.TreasureEventMode.Difficulty;

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

  function getDifficultyQuestId() {
    return Element.Text(".btn-event-raid").call(this).then(() => {
      
    });
  }

  return [
    Location.Change(config.TreasureEventMode.TreasureEventUrl),
    Wait(".atx-lead-link"),
    getDifficultyQuestId,
    checkQuest,
    PipelineLoop.call(this, env, TreasureEventPipeline)
  ];
}

TreasureEventPipeline.test = function() {
  return this.config.TreasureEventMode.Enabled;
};
