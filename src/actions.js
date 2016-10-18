'use strict';

import ActionBuild from './action.build.js';
import ActionHarvest from './action.harvest.js';
import ActionRepair from './action.repair.js';
import ActionTransfer from './action.transfer.js';
import ActionUpgrade from './action.upgrade.js';
import ActionClaim from './action.claim.js';

const actions = {
  build: new ActionBuild([STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_CONTAINER, STRUCTURE_TOWER, STRUCTURE_WALL, STRUCTURE_RAMPART, STRUCTURE_ROAD]),

  // TODO new action for taking energy from containers...
  harvest: new ActionHarvest(),

  repair: new ActionRepair([STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_RAMPART, STRUCTURE_WALL, STRUCTURE_TOWER, STRUCTURE_ROAD, STRUCTURE_CONTAINER]),
  transfer: new ActionTransfer([STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_CONTAINER]),
  upgrade: new ActionUpgrade(),
  // claim: new ActionClaim(),
};
export default actions;
