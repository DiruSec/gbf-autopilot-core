exports = module.exports = (env, config, process, require, run) => () => {
  const Wait = require("steps/Wait");
  const Check = require("steps/Check");
  const Location = require("steps/Location");
  const DefaultPipeline = require("pipelines/Default");

  const eventMode = () => {
    delete env.summonPreferred;
    delete env.summonAttribute;
    delete env.partyGroup;
    delete env.partyDeck;

    env.questUrl = config.EventMode.EventRaidUrl;
    env.luaScript = config.EventMode.EventRaidScript;
    env.questCount = 0;
    env.questMax = 1;
    return env;
  };

  const nightmareMode = () => {
    env.questUrl = config.EventMode.NightmareModeUrl;
    env.luaScript = config.EventMode.NightmareModeScript;
    env.summonPreferred = config.EventMode.NightmareModePreferredSummons;
    env.summonAttribute = config.EventMode.NightmareModeSummonAttributeTab;
    env.partyGroup = Number(config.PartySelection.PreferredNightmareModePartyGroup);
    env.partyDeck = Number(config.PartySelection.PreferredNightmareModePartyDeck);
    env.questCount = 0;
    env.questMax = 1;
    return env;
  };

  const steps = [
    Location.Change(config.EventMode.EventPageUrl),
    Wait(".atx-lead-link"),
    function checkNightmare() {
      if (!config.EventMode.NightmareModeUrl) {
        return eventMode();
      }
      const selector = ".ico-difficulty-5,.ico-difficulty-8";
      return run(Check(selector)).then(nightmareMode, eventMode);
    },
    () => process(DefaultPipeline()),
    () => process(steps)
  ];

  return steps;
};

exports.test = (config) => config.EventMode.Enabled;
exports["@require"] = ["env", "config", "process", "require", "run"];
exports["@name"] = "Event";
