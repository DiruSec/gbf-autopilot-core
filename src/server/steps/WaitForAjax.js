import {createProcess} from "./Helper";

export default function(regexp) {
  return createProcess("WaitForAjax", function(context, lastResult, done, fail) {
    const subscription = this.observables["socket.onBroadcast.ajaxFinish"]
      .filter(({payload}) => payload.url.match(regexp))
      .subscribe(() => {
        subscription.unsubscribe();
        done();
      }, fail);
  });
}
