export default function ajaxFinish(payload) {
  this.emit("socket.broadcast.ajaxFinish", payload);
}
