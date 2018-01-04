import Step from "./Step";

exports = module.exports = function(server, regexp) {
  return Step(function WaitForAjax(_, $, done, fail) {
    const subscription = server.getObservable("socket.broadcast")
      .filter(({name}) => name == "ajaxFinish")
      .filter(({payload}) => payload.url.match(regexp))
      .subscribe(() => {
        subscription.unsubscribe();
        done();
      }, fail);
  }, {
    doNotTimeout: true
  });
};

exports["@require"] = ["server"];
