import { combineReducers, createStore } from 'redux';
import * as reducers from './ducks';
// import { RoleTypes } from './ducks/role';

const rootReducer = combineReducers(reducers);

// Get persisted state
/*const state = localStorage.getItem('state')
  ? JSON.parse(localStorage.getItem('state'))
  : undefined;*/

const store = createStore(rootReducer, /* state */);

// Persist state on every change
/*store.subscribe(() => {
  const state = store.getState();

  // Don't keep state for master
  if (state.role !== RoleTypes.MASTER) {
    localStorage.setItem('state', JSON.stringify(state));
  }
});*/

export default store;
