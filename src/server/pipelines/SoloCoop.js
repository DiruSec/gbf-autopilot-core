exports = module.exports = (env, require, run, process, logger, config) => () => {
  const Wait = require("steps/Wait");
  const Check = require("steps/Check");
  const Click = require("steps/Click");
  const Battle = require("steps/Battle");
  const Element = require("steps/Element");
  const Location = require("steps/Location");
  const CheckAP = require("steps/Quest/CheckAP");

  const saveCoopRoomUrl = async () => {
    const location = await run(Location());
    return env.coopRoomUrl = location.href;
  };

  const checkStartButton = async () => {
    try {
      await run(Check(".btn-quest-start.se-quest-start"));
    } catch (e) {
      logger.info("Waiting for quest to be set...");
      await run(Wait(".btn-quest-start.se-quest-start"));
    }
    return true;
  };

  const checkAP = async () => {
    const attrs = await run(Element.Attributes(".btn-quest-start", ["data-quest-id", "data-type"]));
    await run(CheckAP({
      questId: attrs["data-quest-id"],
      type: attrs["data-type"]
    }));
    return true;
  };

  const clickStartButton = async () => {
    return await run(Click.Condition(".btn-quest-start"));
  };

  const steps = [
    Wait(".cnt-global-footer"),
    saveCoopRoomUrl,
    checkStartButton,
    checkAP,
    clickStartButton,
    Battle.Loop(config.SoloCoopMode.LuaScript),
    () => run(Location.Change(env.coopRoomUrl)), // need to do this since the url may not have been set yet
    () => process(steps)
  ];
  return steps;
};

exports.test = (config) => config.SoloCoopMode.Enabled;
exports["@require"] = ["env", "require", "run", "process", "logger", "config"];
exports["@name"] = "SoloCoop";
