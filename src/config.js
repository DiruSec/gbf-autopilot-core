import path from "path";

export default {
  keyDelay: 50,
  popupDelay: 500,
  scrollDelay: 50,
  redirectDelay: 1500,

  rootDir: path.resolve(__dirname, ".."),
  scriptDir: path.resolve(__dirname, "../scripts"),
  scripts: [
    "functions.lua",
    "state.lua",
    "characters.lua",
    "combat.lua",
    "main.lua"
  ]
};
