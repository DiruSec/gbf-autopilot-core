import path from "path";
import assign from "lodash/assign";
import forEach from "lodash/forEach";
import coreConfig from "~/config";
import * as Battle from "~/server/steps/Battle";
import DefaultPipeline from "./Default";

function wrap(cb) {
  return function() {
    const args = [this.valueOf()];
    forEach(arguments, (arg) => args.push(arg));
    return cb.apply(cb, args);
  };
}

function initScheduling(env) {
  const rootDir = this.rootDir;
  assign(env.scriptEnv, {
    SetLuaScript: wrap((scriptPath) => {
      env.luaScript = path.resolve(rootDir, scriptPath);
    }),
    _repeatQuest: wrap((questPage, ap, repeatCount) => {
      env.questCount = 0;
      env.questUrl = questPage;
      env.maxQuest = repeatCount;
      return function({manager}) {
        const pipeline = DefaultPipeline.call(this, env);
        return manager.process(pipeline);
      };
    })
  });
  env.schedulingInit = true;
}

export default function SchedulingPipeline(env) {
  if (!env.schedulingInit) {
    initScheduling.call(this, env);
  }

  const config = this.config;
  const schedulingScriptPath = path.resolve(this.rootDir, config.CustomizedScheduling.SchedulingLuaScript);

  return [
    Battle.Script(env, schedulingScriptPath, null, path.resolve(coreConfig.scriptDir, "scheduling.lua"))
  ];
}

SchedulingPipeline.test = function() {
  return this.config.CustomizedScheduling.Enabled;
};
