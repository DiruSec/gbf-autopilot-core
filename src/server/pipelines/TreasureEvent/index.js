import coreConfig from "~/config";

import Timeout from "~/server/steps/Timeout";
import * as Location from "~/server/steps/Location";
import * as Battle from "~/server/steps/Battle";

export default function TreasureEventPipeline() {
  const config = this.config;
  return [
    Location.Change(config.TreasureEventMode.TreasureEventSoloUrl),
    Timeout(coreConfig.redirectDelay),
    Battle.Supporter()
  ];
}

TreasureEventPipeline.test = function() {
  return this.config.TreasureEventMode.Enabled;
};
