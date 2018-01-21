import * as StateHelper from "~/helpers/StateHelper";
import {assert} from "chai";

describe("Test state helper", () => {
  const deadState = {
    enemies: [{
      hp: 0
    }]
  };

  const aliveState = {
    enemies: [{
      hp: 100
    }]
  };

  it("should not have any alive enemies", () => {
    assert.equal(StateHelper.enemyAlive(deadState), 0);
  });

  it("should have an alive enemy", () => {
    assert.equal(StateHelper.enemyAlive(aliveState), 1);
  });
});

