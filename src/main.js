'use strict';

import MemoryPurger from './memory-purger.js';
import CreepSpawner from './creep-spawner.js';
import Defender from './defender.js';

const purger = new MemoryPurger();
const spawner = new CreepSpawner({
  harvester: 10,
  builder: 5,
  upgrader: 6,
  repairer: 4,
});
const defender = new Defender();
import roles from './roles.js';

export function loop () {
  purger.run();

  for (const spawnName in Game.spawns) {
    const spawn = Game.spawns[spawnName];
    spawner.run(spawn);
  }

  defender.run();

  for(const creepName in Game.creeps) {
    const creep = Game.creeps[creepName];
    const role = roles[creep.memory.role];
    if (role) {
      role.run(creep);
    }
  }
}
