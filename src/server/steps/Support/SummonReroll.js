import Step2 from "../Step2";

const trialPage = "#quest/supporter/990011/17";

exports = module.exports = (env, require, context, process) => (
  summons,
  type,
  questPage
) => {
  const { server, worker } = context;

  const Location = require("steps/Location");
  const Support = require("steps/Support");
  const Timeout = require("steps/Timeout");
  const Combat = require("steps/Combat");
  const Wait = require("steps/Wait");
  const Key = require("steps/Key");

  const returnToQuestPage = Step2(payload => {
    return process([
      Location.Change(questPage),
      Wait(".atx-lead-link"),
      Support.SelectElement(type)
    ]).then(() => payload);
  });

  const enterTrialBattle = (retry, payload) =>
    process([
      () => server.makeRequest("click", payload),
      Wait(".pop-deck.supporter"),
      Support.StartBattle(),
      Wait(".pop-usual.pop-show"),
      Key.Press("space"),
      Timeout(1500),
      Combat.Retreat(),
      retry
    ]);

  const checkSummons = () =>
    process([
      Location.Change(trialPage),
      Wait(".atx-lead-link"),
      Support.SelectElement(type),
      () => worker.sendAction("support", summons),
      Step2(payload => {
        return payload.preferred
          ? payload
          : enterTrialBattle(checkSummons, payload);
      })
    ]);

  return [checkSummons, returnToQuestPage];
};
exports["@require"] = ["env", "require", "context", "process", "run"];
