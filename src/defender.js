'use strict';

export default class Defender {

  constructor() {
  }

  run() {
    const tower = Game.getObjectById('7c5cd390e489651f737838da');
    if(tower) {
      const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => structure.hits < structure.hitsMax
      });
      if(closestDamagedStructure) {
        tower.repair(closestDamagedStructure);
      }

      const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if(closestHostile) {
        tower.attack(closestHostile);
      }
    }
  }
}
