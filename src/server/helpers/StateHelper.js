export function enemyAlive(state) {
  var count = 0;
  state.enemies.forEach((enemy) => {
    if (enemy.hp > 0) count++;
  });
  return count;
}
