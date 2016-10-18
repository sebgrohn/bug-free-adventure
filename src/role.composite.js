'use strict';

export default class RoleComposite {

  constructor(actions) {
    this._actions = actions;
    this._firstAction = Object.keys(actions)[0];
  }

  run(creep) {
    const actionSpec = this._actions[creep.memory.action];
    const event = this._run(creep, actionSpec);
    this._tryTransition(creep, actionSpec, event);

    // NOTE add deprecated memory fields here
    // delete creep.memory.;
  }

  _run(creep, actionSpec) {
    if (actionSpec) {
      return actionSpec.action.run(creep);
    }
  }

  _tryTransition(creep, actionSpec, event) {
    if (actionSpec) {
      if (event) {
        const nextAction = actionSpec.nextActions[event];
        this._transition(creep, nextAction || this._firstAction);
      }
    } else {
      this._transition(creep, this._firstAction);
    }
  }

  _transition(creep, nextAction) {
    console.log(`Creep ${creep.name}: transitioning ${creep.memory.action} -> ${nextAction}`);
    creep.memory.action = nextAction;
    creep.say(nextAction);
  }
}
