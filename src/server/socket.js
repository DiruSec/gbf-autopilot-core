const registerDebug = (server, hooks) => {
  hooks.forEach((hook) => {
    server.on("socket." + hook, ({data}) => {
      server.logger.debug(hook, data);
    });
  });
};

export default function socket() {
  if (this.config.Log.DebugSocket) {
    registerDebug(this, ["actionSuccess", "actionFail", "sendAction"]);
  }
  return {};
}
