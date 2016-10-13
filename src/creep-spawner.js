'use strict';

const structureTypes = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION];

export default class CreepSpawner {

  constructor(spawnId, roleWeights) {
    this._spawnId = spawnId;
    this._roleWeights = roleWeights;
  }

  run() {
    const energyStats = this._getEnergyStats();
    const roleStats = this._getRoleStats();
    // console.log(JSON.stringify(roleStats));
    for (const roleStat of roleStats) {
      const { role, count, quota, targetQuota } = roleStat;
      // console.log(role, count, quota, targetQuota, targetQuota - quota);
      const body = this._getBody(role, energyStats, roleStat);
      if (this._trySpawn(role, body)) {
        break;
      }
    }
  }

  _getEnergyStats() {
    const spawn = this._getTarget();

    const structures = spawn.room.find(FIND_STRUCTURES, {
      filter: structure => structureTypes.indexOf(structure.structureType) !== -1,
    });

    return _.reduce(structures, (acc, structure) => {
      acc.energy = acc.energy + structure.energy;
      acc.energyCapacity = acc.energyCapacity + structure.energyCapacity;
      return acc;
    }, { energy: 0, energyCapacity: 0 });
  }

  _getRoleStats() {
    const counts = _(Game.creeps)
      .groupBy(creep => creep.memory.role)
      .map((creeps, role) => [role, creeps.length])
      .zipObject()
      .value();
    const populationCount = Object.keys(Game.creeps).length;
    const weightSum = _.sum(this._roleWeights);

    return _(this._roleWeights)
      .map((targetWeight, role) => ({
        role,
        count: counts[role] || 0,
        targetWeight,
        quota: populationCount ? (counts[role] || 0) / populationCount : 1,
        targetQuota: weightSum ? targetWeight / weightSum : 1,
      }))
      .sortByAll(
        ({ count, targetWeight }) => targetWeight === 0,
        ({ count, targetWeight }) => count !== 0,
        ({ quota, targetQuota }) => quota - targetQuota)
      .value();
  }

  _getBody(role, energyStats, roleStat) {
    const bodies = {
      // level 1
      300: [WORK, CARRY, CARRY, MOVE, MOVE],

      // level 2
      350: [WORK,       CARRY, CARRY,        MOVE, MOVE, MOVE],
      // 400: [WORK,       CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
      400: [WORK, WORK, CARRY, CARRY,        MOVE, MOVE],
      450: [WORK,       CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
      500: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE],
      550: [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],

      // level 3
      600: [WORK, WORK, WORK, CARRY, CARRY,               MOVE, MOVE, MOVE, MOVE],
      650: [WORK, WORK,       CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
      700: [WORK, WORK, WORK, CARRY, CARRY, CARRY,        MOVE, MOVE, MOVE, MOVE, MOVE],
      750: [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
      800: [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
    };

    if (roleStat.count === 0) {
      return bodies[energyStats.energy - energyStats.energy % 50] || bodies[300];
    } else {
      return bodies[energyStats.energyCapacity - energyStats.energyCapacity % 50 - 300] || bodies[300];
    }
  }

  _trySpawn(role, body) {
    const spawn = this._getTarget();

    if (spawn.canCreateCreep(body) === OK && !spawn.spawning) {
      const highestCreepIndex = _(Game.creeps)
        .filter(creep => creep.name.match(role))
        .map(creep => +_.last(creep.name.match(/(\w+)-(\d+)/)))
        .max();
      const nextCreepIndex = highestCreepIndex >= 0 ? highestCreepIndex + 1 : 0;
      const creepName = spawn.createCreep(body, `${role}-${nextCreepIndex}`, { role });
      console.log(`Spawning new ${role}: ${creepName} (${body})`);
      return true;
    }
    return false;
  }

  _getTarget() {
    return Game.getObjectById(this._spawnId);
  }
}
