import * as LocationHelper from "~/helpers/LocationHelper";
import {assert} from "chai";
import {URL} from "url";

describe("Test location helpers", () => {
  describe("Convert location to string", () => {
    const locationToString = LocationHelper.locationToString;
    const href = "http://game.granbluefantasy.jp/#mypage";

    it("should convert URL object", () => {
      const url = new URL(href);
      const str = locationToString(url);
      assert.isString(str);
      assert.equal(str, href);
    });

    it("should convert Location object", () => {
      const location = {href};
      const str = locationToString(location);
      assert.isString(str);
      assert.equal(str, href);
    });

    it("should return back the string", () => {
      const url = locationToString(href);
      assert.equal(url, href);
    });

    it("should throw unknown data type error", () => {
      assert.throws(() => {
        locationToString({x: "y"});
      }, Error, /data type/);
    });
  });


  const url = new URL("http://game.granbluefantasy.jp/#mypage");

  it("should be a quest supporter page", () => {
    url.hash = "#quest/supporter/510031/5";
    assert(LocationHelper.isSupporterPage(url));
  });

  it("should be a GW supporter page", () => {
    url.hash = "#event/teamraid035/supporter/724781/1";
    assert(LocationHelper.isSupporterPage(url));
  });

  it("should be a solo battle page", () => {
    url.hash = "#raid/12345678";
    assert(LocationHelper.isBattlePage(url));
  });

  it("should be a raid battle page", () => {
    url.hash = "#raid_multi/12345678";
    assert(LocationHelper.isBattlePage(url));
  });

  it("should be a result solo battle page", () => {
    url.hash = "#result/123456789";
    assert(LocationHelper.isResultPage(url));
  });

  it("should be a result raid battle page", () => {
    url.hash = "#result_multi/123456789";
    assert(LocationHelper.isResultPage(url));
  });
});
