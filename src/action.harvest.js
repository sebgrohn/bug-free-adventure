'use strict';

export default class ActionHarvest {

  constructor() {
  }

  run(creep) {
    const target = this._getTarget(creep);
    if (!target) {
      this._clearTarget(creep);
      return 'noTarget';
    }

    const status = creep.harvest(target);
    switch (status) {
      case ERR_NOT_IN_RANGE:
        if (creep.moveTo(target) === ERR_NO_PATH) {
          this._clearTarget(creep);
          creep.say('blocked');
        }
        break;

      case ERR_NOT_ENOUGH_RESOURCES:
        this._clearTarget(creep);
        creep.say('emptied');
        break;
    }

    if (this._isDone(creep)) {
      this._clearTarget(creep);
      return 'done';
    }
  }

  _getTarget(creep) {
    if (!creep.memory.targetId) {
      const sources = creep.room.find(FIND_SOURCES);
      creep.memory.targetId = sources[Math.floor(Math.random() * sources.length)].id;
      console.log(`Creep ${creep.name}: selected target at ${(Game.getObjectById(creep.memory.targetId) || {}).pos}`);
    }
    return Game.getObjectById(creep.memory.targetId);
  }

  _isDone(creep) {
    return creep.carry.energy === creep.carryCapacity;
  }

  _clearTarget(creep) {
    delete creep.memory.targetId;
  }
}
