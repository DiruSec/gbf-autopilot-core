import * as Battle from "~/server/steps/Battle";
import * as Location from "~/server/steps/Location";
import OpenQuestPage from "~/server/steps/Quest/OpenPage";
import PipelineLoop from "~/server/steps/PipelineLoop";
import Check from "~/server/steps/Check";
import Wait from "~/server/steps/Wait";

export default function EventPipeline(env) {
  const config = this.config;
  const nightmareMode = (manager) => {
    return manager.process([
      OpenQuestPage(env, config.EventMode.NightmareModeUrl),
      Battle.Supporter(env, {
        summonAttribute: config.EventMode.NightmareModeSummonAttributeTab,
        summonPreferred: config.EventMode.NightmareModePreferredSummons,
        partyGroup: Number(config.PartySelection.PreferredNightmareModePartyGroup),
        partyDeck: Number(config.PartySelection.PreferredNightmareModePartyDeck)
      }),
      Battle.Loop(env, config.EventMode.NightmareModeScript)
    ]);
  };

  const eventMode = (manager) => {
    return manager.process([
      OpenQuestPage(env, config.EventMode.EventRaidUrl),
      Battle.Supporter(env),
      Battle.Loop(env, config.EventMode.EventRaidScript),
    ]);
  };

  return [
    Location.Change(config.EventMode.EventPageUrl),
    // TODO: check for nightmare stage
    Wait(".atx-lead-link"),
    function checkNightmare(context) {
      const manager = context.manager;
      // skip if nightmare mode url is not provided
      if (!config.EventMode.NightmareModeUrl) {
        return eventMode(manager);
      }

      const selector = ".ico-difficulty-5,.ico-difficulty-8";
      return Check(selector).call(this, context).then(() => {
        return nightmareMode(manager);
      }, () => {
        return eventMode(manager);
      });
    },
    PipelineLoop.call(this, env, EventPipeline)
  ];
}

EventPipeline.test = function() {
  return this.config.EventMode.Enabled;
};
