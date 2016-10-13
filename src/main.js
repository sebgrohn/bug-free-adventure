'use strict';

import MemoryPurger from './memory-purger.js';
import CreepSpawner from './creep-spawner.js';
import Defender from './defender.js';

const spawn = Game.spawns['Spawn1'];
const purger = new MemoryPurger(spawn && spawn.id);
const spawner = new CreepSpawner(spawn && spawn.id, {
  harvester: 10,
  builder: 5,
  upgrader: 6,
  repairer: 4,
});
const defender = new Defender();
import roles from './roles.js';

export function loop () {
  purger.run();
  spawner.run();
  defender.run();

  for(const creepName in Game.creeps) {
    const creep = Game.creeps[creepName];
    const role = roles[creep.memory.role];
    if (role) {
      role.run(creep);
    }
  }
}
