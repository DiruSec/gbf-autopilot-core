import {URL} from "url";
import Step from "../Step";

exports = module.exports = (server) => (url) => {
  return Step("Location", function Wait(_, $, done, fail) {
    const subscription = server.getObservable("socket.broadcast")
      .filter(({name}) => name == "hashchange")
      .filter(({payload}) => payload.newUrl.match(url))
      .map(({payload}) => ({
        newUrl: new URL(payload.newUrl),
        oldUrl: new URL(payload.oldUrl)
      }))
      .subscribe((evt) => {
        subscription.unsubscribe();
        done(evt);
      }, fail);
  });
};

exports["@require"] = ["server"];
