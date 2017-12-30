import {createProcess} from "./Helper";

export default function(regexp) {
  return createProcess("WaitForAjax", function(context, lastResult, done, fail) {
    const subscription = this.server.getObservable("socket.broadcast")
      .filter(({name}) => name == "ajaxFinish")
      .filter(({payload}) => payload.url.match(regexp))
      .subscribe(() => {
        subscription.unsubscribe();
        done();
      }, fail);
  }, {
    doNotTimeout: true
  });
}
