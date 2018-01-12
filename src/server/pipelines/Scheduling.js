import path from "canonical-path";
import assign from "lodash/assign";

const wrap = (func) => function(...args) {
  args.unshift(this.valueOf());
  return func.apply(func, args);
};

const initScheduling = (env, server, process) => (pipeline) => {
  const rootDir = server.rootDir;
  assign(env.scriptEnv, {
    SetLuaScript: wrap((scriptPath) => {
      env.luaScript = path.resolve(rootDir, scriptPath);
    }),
    SetSummonPreferred: wrap((...summons) => {
      env.summonPreferred = summons;
    }),
    SetSummonAttribute: wrap((element) => {
      env.summonAttribute = element;
    }),
    SetPartyGroup: wrap((group) => {
      env.partyGroup = group;
    }),
    SetPartyDeck: wrap((deck) => {
      env.partyDeck = deck;
    }),
    _repeatQuest: wrap((questPage, ap, repeatCount) => {
      env.questCount = 0;
      env.questUrl = questPage;
      env.questMax = repeatCount;
      return () => process(pipeline());
    })
  });
  env.schedulingInit = true;
};
initScheduling["@require"] = ["env", "server", "process"];

exports = module.exports = (env, inject, require, server, config, coreConfig) => () => {
  const Battle = require("steps/Battle");
  const scriptPath = env.schedulingLuaScript || path.resolve(server.rootDir, config.CustomizedScheduling.SchedulingLuaScript);
  const mainScriptPath = path.resolve(coreConfig.scriptDir, "scheduling.lua");

  return [
    () => {
      if (!env.schedulingInit) {
        const pipeline = require("pipelines/Default");
        inject(initScheduling)(pipeline);
      }
    },
    Battle.Script(scriptPath, null, mainScriptPath)
  ];
};

exports.test = (config) => config.CustomizedScheduling.Enabled;
exports["@require"] = ["env", "inject", "require", "server", "config", "coreConfig"];
exports["@name"] = "Scheduling";
