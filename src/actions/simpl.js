import { createNamedAction } from '../utils/actions';
import { Autobahn as AutobahnReact } from 'autobahn-react';

/*
 * action creators
 */

export const addChild = createNamedAction('CHILD_ADD');
export const removeChild = createNamedAction('CHILD_REMOVE');

/**
 * Given a scope's topic return a recursive representation of that scope and its
 * children.
 * @function
 * @memberof Simpl.actions.simpl
 * @param {string} scope - the scope's topic
 * @returns {NamedReduxAction}
 */
export const getDataTree = createNamedAction('DATATREE_GET', (scope, ...args) => (
  AutobahnReact.call(`${scope}.get_scope_tree`, args)
));
export const getRunUsers = createNamedAction('RUNUSERS_GET', (scope, ...args) => (
  AutobahnReact.call(`${scope}.get_active_runusers`, args)
));
export const updateScope = createNamedAction('SCOPE_UPDATE');
export const connectedScope = createNamedAction('SCOPE_CONNECTED', (scope, ...args) => (
  AutobahnReact.publish(`${scope}.connected`, args)
));
export const disconnectedScope = createNamedAction('SCOPE_DISCONNECTED', (scope, ...args) => (
  AutobahnReact.publish(`${scope}.disconnected`, args)
));

export const getCurrentRunPhase = createNamedAction('CURRENT_RUN', (scope, ...args) => (
  AutobahnReact.call(`${scope}.get_current_run_and_phase`, args)
));

export const getPhases = createNamedAction('GET_PHASES', (scope, ...args) => (
  AutobahnReact.call(`${scope}.get_phases`, args)
));

export const getRoles = createNamedAction('GET_ROLES', (scope, ...args) => (
  AutobahnReact.call(`${scope}.get_roles`, args)
));

// populate simpl.user space with current user's info
export const getUserInfo = createNamedAction('GET_USER_INFO');


/**
 * @namespace simpl
 * @memberof Simpl.actions
 */
export default {
  addChild,
  removeChild,

  getDataTree,
  getRunUsers,
  updateScope,
  connectedScope,
  disconnectedScope,
  getCurrentRunPhase,
  getUserInfo,
  getPhases,
  getRoles,
};
