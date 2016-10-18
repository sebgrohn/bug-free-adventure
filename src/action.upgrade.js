'use strict';

export default class ActionUpgrade {

  constructor() {
  }

  run(creep) {
    const target = this._getTarget(creep);
    if (!target) {
      return 'noTarget';
    }

    const status = creep.upgradeController(target);
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

    if (creep.upgradeController(target) === ERR_NOT_IN_RANGE) {
      if (creep.moveTo(target) === ERR_NO_PATH) {
        creep.say('blocked');
      }
    }

    if (this._isDone(creep)) {
      return 'done';
    }
  }

  _getTarget(creep) {
    return creep.room.controller;
  }

  _isDone(creep) {
    return creep.carry.energy === 0;
  }
}
