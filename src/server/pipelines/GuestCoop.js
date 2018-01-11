exports = module.exports = (require, config, run, process) => () => {
  const Wait = require("steps/Wait");
  const Battle = require("steps/Battle");

  const saveCoopRoomUrl = () => {
    
  };

  const refreshRoom = () => {

  };

  const waitForStartButton = () => new Promise((resolve, reject) => {
  });

  const steps = [
    saveCoopRoomUrl,
    waitForStartButton,
    Wait(".btn-attack-start"),
    Battle.Loop(config.GuestCoopMode.LuaScript),
    () => process(steps)
  ];
  return steps;
};
exports.test = (config) => config.GuestCoopMode.Enabled;
exports["@require"] = ["require", "config", "run", "process"];
exports["@name"] = "GuestCoop";
