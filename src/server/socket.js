export default function socket() {
  this.on("socket.actionSuccess", ({data}) => {
    this.logger.debug("actionSuccess", data);
  });
  this.on("socket.actionFail", ({data}) => {
    this.logger.debug("actionFail", data);
  });
  return {};
}
