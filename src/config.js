import path from "path";
import {name} from "../package.json";
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

  rootDir: path.resolve(__dirname, ".."),

  defaultPipeline: DefaultPipeline,
  pipelines: [
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
};
