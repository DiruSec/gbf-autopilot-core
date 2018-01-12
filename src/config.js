import path from "canonical-path";
import {name} from "../package.json";
import SchedulingPipeline from "~/server/pipelines/Scheduling";
import CoopSoloPipeline from "~/server/pipelines/CoopSolo";
import CoopGuestPipeline from "~/server/pipelines/CoopGuest";
import EventTreasurePipeline from "~/server/pipelines/EventTreasure";
import EventPipeline from "~/server/pipelines/Event";
import TrialPipeline from "~/server/pipelines/Trial";
import DefaultPipeline from "~/server/pipelines/Default";

export default {
  name,

  keyDelay: 50,
  popupDelay: 500,
  scrollDelay: 50,
  redirectDelay: 1500,
  actionDelay: 1500,
  reclickDelay: 1500,

  rootDir: path.resolve(__dirname, ".."),

  defaultPipeline: DefaultPipeline,
  pipelines: [
    TrialPipeline,
    SchedulingPipeline,
    CoopSoloPipeline,
    CoopGuestPipeline,
    EventTreasurePipeline,
    EventPipeline
  ],

  scriptDir: path.resolve(__dirname, "../scripts"),
  mainScript: "main.lua",
  scripts: [
    "functions.lua",
    "state.lua",
    "characters.lua",
    "enemies.lua",
    "combat.lua",
  ],

  treasureRequired: 3,
  getExtension(server) {
    return server.extensions[this.name];
  }
};
