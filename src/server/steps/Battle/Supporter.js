import {URL} from "url";
import noop from "lodash/noop";
import coreConfig from "~/config";
import {createProcess} from "../Helper";

import * as Support from "../Support";
import Timeout from "../Timeout";
import Wait from "../Wait";
import Ajax from "../Ajax";

export default function Supporter(options, env) {
  options = options || {};
  env = env || {};

  const url = new URL(options.url || env.questUrl);
  const hash = url.hash.match(/[^\d]+(\d+)\/(\d+)/);
  return createProcess("Battle.Supporter", function({manager}) {
    const config = this.config;
    const summonAttribute = options.summonAttribute || config.Summons.DefaultSummonAttributeTab;
    const summonPreferred = options.summonPreferred || config.Summons.PreferredSummons;
    const partyGroup = options.partyGroup || Number(config.PartySelection.PreferredPartyGroup);
    const partyDeck = options.partyDeck || Number(config.PartySelection.PreferredPartyDeck);

    function maybeRefillAP(context, {user, quest}) {
      const options = {
        url: "/item/use_normal_item",
        method: "POST",
        data: JSON.stringify({
          item_id: 2,
          num: 1,
          special_token: null
        }),
      };
      return quest.action_point > user.action_point ?
        Ajax(options).call(this, context) : null;
    }

    function checkAP() {
      var userData;
      return manager.process([
        Ajax("/quest/user_action_point"),
        function setUserData(data) {
          userData = data;
        },
        Ajax("/quest/quest_data/" + hash[1] + "/" + hash[2]),
        function composeData(questData) {
          return {
            user: userData,
            quest: questData
          };
        },
        maybeRefillAP
      ]);
    }

    return manager.process([
      url ? checkAP : noop,
      Wait(".atx-lead-link"),
      Support.SelectElement(summonAttribute),
      Timeout(coreConfig.scrollDelay),   
      Support.SelectSummon(summonPreferred),

      Wait(".pop-deck.supporter"),
      Timeout(coreConfig.popupDelay),
      Support.SelectPartyGroup(partyGroup),
      Timeout(coreConfig.popupDelay),   
      Support.SelectPartyDeck(partyDeck),
      Support.StartBattle(),
    ]);
  });
}
