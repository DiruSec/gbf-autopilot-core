/**
 * Check how many enemies are still alive
 * @param {State} state 
 * @returns {number}
 */
export function enemyAlive(state) {
  var count = 0;
  state.enemies.forEach((enemy) => {
    if (enemy.hp > 0) count++;
  });
  return count;
}

/**
 * @typedef {Object} State
 * @property {Array<Enemy>} enemies
 */

/**
 * @typedef {Object} Enemy
 * @property {number} hp
 */
