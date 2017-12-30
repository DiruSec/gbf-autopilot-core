import {URL} from "url";
import {createProcess} from "../Helper";

export default function(url) {
  return createProcess("Location.Wait", function(_, $, done, fail) {
    const subscription = this.server.getObservable("socket.broadcast")
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
}
