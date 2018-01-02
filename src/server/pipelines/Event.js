import * as Location from "~/server/steps/Location";
import * as Battle from "~/server/steps/Battle";
import PipelineLoop from "~/server/steps/PipelineLoop";
import Check from "~/server/steps/Check";
import Wait from "~/server/steps/Wait";

export default function EventPipeline(env) {
  const config = this.config;
  const nightmareMode = (manager) => {
    return manager.process([
      Location.Change(config.EventMode.NightmareModeUrl),
      Battle.Supporter({
        url: config.EventMode.NightmareModeUrl,
        summonAttribute: config.EventMode.NightmareModeSummonAttributeTab,
        summonPreferred: config.EventMode.NightmareModePreferredSummons,
        partyGroup: Number(config.PartySelection.PreferredNightmareModePartyGroup),
        partyDeck: Number(config.PartySelection.PreferredNightmareModePartyDeck)
      }, env),
      Battle.Loop(config.EventMode.NightmareModeScript, env)
    ]);
  };

  const eventMode = (manager) => {
    return manager.process([
      Location.Change(config.EventMode.EventRaidUrl),
      Battle.Supporter({
        url: config.EventMode.EventRaidUrl
      }, env),
      Battle.Loop(config.EventMode.EventRaidScript, env),
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
    PipelineLoop.call(this, EventPipeline, env)
  ];
}

EventPipeline.test = function() {
  return this.config.EventMode.Enabled;
};
