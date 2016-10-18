'use strict';

export default class MemoryPurger {

  constructor() {
  }

  run() {
    for(const name in Memory.creeps) {
      if(!Game.creeps[name]) {
        console.log(`Clearing non-existing creep memory: ${name} (${Memory.creeps[name].role})`);
        delete Memory.creeps[name];
      }
    }
  }
}
