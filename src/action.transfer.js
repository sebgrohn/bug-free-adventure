'use strict';

export default class ActionTransfer {

  constructor(structureTypes = undefined) {
    this._structureTypes = structureTypes || [];
  }

  run(creep) {
    const target = this._getTarget(creep);
    if (!target) {
      this._clearTarget(creep);
      return 'noTarget';
    }

    const status = creep.transfer(target, RESOURCE_ENERGY);
    switch (status) {
      case ERR_NOT_IN_RANGE:
        if (creep.moveTo(target) === ERR_NO_PATH) {
          this._clearTarget(creep);
          creep.say('blocked');
        }
        break;

      case ERR_FULL:
        this._clearTarget(creep);
        creep.say('filled');
        break;
    }

    if (this._isDone(creep)) {
      this._clearTarget(creep);
      return 'done';
    }
  }

  _getTarget(creep) {
    if (!creep.memory.targetId) {
      const targets = creep.room.find(FIND_STRUCTURES, {
        filter: structure => (this._structureTypes.length === 0
            || this._structureTypes.indexOf(structure.structureType) !== -1)
          && (structure.energy < structure.energyCapacity
            || (structure.store && _.sum(structure.store) < structure.storeCapacity)),
      });
      creep.memory.targetId = _(targets)
        .sortBy(structure => this._structureTypes.indexOf(structure.structureType))
        .map(structure => structure.id)
        .head();
      console.log(`Creep ${creep.name}: selected target at ${(Game.getObjectById(creep.memory.targetId) || {}).pos}`);
    }
    return Game.getObjectById(creep.memory.targetId);
  }

  _isDone(creep) {
    return creep.carry.energy === 0;
  }

  _clearTarget(creep) {
    delete creep.memory.targetId;
  }
}
