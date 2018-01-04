import path from "path";
import {name} from "../package.json";
import SchedulingPipeline from "~/server/pipelines/Scheduling";
import TreasureEventPipeline from "~/server/pipelines/TreasureEvent";
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
    SchedulingPipeline,
    TrialPipeline,
    TreasureEventPipeline,
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
  getPlugin(server) {
    return server.coreExtension;
  }
};
