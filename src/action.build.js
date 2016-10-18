'use strict';

export default class ActionBuild {

  constructor(defaultStructureTypes = undefined) {
    this._defaultStructureTypes = defaultStructureTypes || [];
  }

  run(creep) {
    const target = this._getTarget(creep);
    if (!target) {
      this._clearTarget(creep);
      return 'noTarget';
    }

    const status = creep.build(target);
    switch (status) {
      case ERR_NOT_IN_RANGE:
        if (creep.moveTo(target) === ERR_NO_PATH) {
          this._clearTarget(creep);
          creep.say('blocked');
        }
        break;

      case ERR_INVALID_TARGET:
        this._clearTarget(creep);
        creep.say('invalid');
        break;
    }

    if (this._isDone(creep)) {
      this._clearTarget(creep);
      return 'done';
    }
  }

  _getTarget(creep) {
    if (!creep.memory.build_structureTypes) {
      creep.memory.build_structureTypes = this._defaultStructureTypes;
    }

    if (!creep.memory.targetId) {
      const targets = creep.room.find(FIND_CONSTRUCTION_SITES, {
        filter: structure => creep.memory.build_structureTypes.length === 0
          || creep.memory.build_structureTypes.indexOf(structure.structureType) !== -1,
      });
      creep.memory.targetId = _(targets)
        .sortBy(structure => creep.memory.build_structureTypes.indexOf(structure.structureType), structure => structure.pos.getRangeTo(creep))
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