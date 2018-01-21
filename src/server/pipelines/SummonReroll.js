import Step2 from "../steps/Step2";

const trialPage = "#quest/supporter/990011/17";

exports = module.exports = (env, config, require, context, process, run) => (summons, type, questPage) => {
  const {server, worker, logger} = context;

  const Location = require("steps/Location");
  const Support = require("steps/Support");
  const Timeout = require("steps/Timeout");
  const Combat = require("steps/Combat");
  const Wait = require("steps/Wait");
  const Key = require("steps/Key");

  summons = summons || env.summonPreferred || config.Summons.PreferredSummons;
  type = type || env.summonAttribute || config.Summons.DefaultSummonAttributeTab;

  const returnToQuestPage = Step2((payload) => {
    return process([
      Location.Change(questPage),
      Wait(".atx-lead-link"),
      Support.SelectElement(type),
    ]).then(() => payload);
  });

  const enterTrialBattle = (retry, payload) => process([
    () => server.makeRequest("click", payload),
    Wait(".pop-deck.supporter"),
    Support.StartBattle(),
    Wait(".pop-usual.pop-show"),
    Key.Press("space"), Timeout(1500),
    Combat.Retreat(),
    retry
  ]);

  const checkSummons = () => process([
    Location.Change(trialPage),
    Wait(".atx-lead-link"),
    Support.SelectElement(type),
    () => worker.sendAction("support", summons),
    Step2((payload) => {
      return payload.preferred ? payload : enterTrialBattle(checkSummons, payload);
    })
  ]);

  const checkLocation = () => {
    if (questPage) return questPage;
    return run(Location()).then((location) => {
      if (location.hash.indexOf("/supporter/") >= 0) {
        return questPage = location.hash;
      }
      logger.info("Waiting for supporter page...");
      return run(Location.Wait()).then(checkLocation);
    });
  };

  return [
    checkLocation,
    checkSummons,
    returnToQuestPage
  ];
};
exports["@require"] = ["env", "config", "require", "context", "process", "run"];
exports.test = (config) => config.Summons.OnlyRerollSummonsEnabled;
