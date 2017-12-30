import {createProcess} from "./Helper";

const ajaxFinishEvent = "socket.broadcast.ajaxFinish";

export default function(regexp, timeout) {
  return createProcess("WaitForAjax", function(context, lastResult, done, fail) {
    timeout = timeout || this.config.Server.WaitAjaxTimeoutInMs;
    const timeoutInstance = setTimeout(() => {
      fail(new Error("Ajax timeout"));
    }, timeout);
    const subscription = this.server.getObservable(ajaxFinishEvent)
      .filter(({payload}) => payload.url.match(regexp))
      .subscribe(() => {
        clearTimeout(timeoutInstance);
        subscription.unsubscribe();
        done();
      }, fail);
  });
}
